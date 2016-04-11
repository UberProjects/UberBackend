/**
 *
 * Created by Matthias on 2/3/16.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');
var User = mongoose.model('User');
var passport = require('passport');
var pushUtil = require('../../../utils/pushUtil.js');
var uberUtil = require('../../../utils/uberUtil.js');
var utils = require('../../../utils/utils.js');
var async = require('async');
var listeners = {};

function RideFormationController() {
}

var myIo = {};
function coreSockets() {
    var socketLoad = this.app.get('socketDeffer');

    socketLoad.promise.then(function (io) {
        myIo = io;
        //On connection create and join a new room
        //this will allow for others to join this room
        //providing the socket id will allow for individual communication
        io.on('connection', function (socket) {
            var newRoomId = utils.getUUID();
            socket.join(newRoomId);
            socket.emit('socket_id', {
                socket_id: socket.id,
                room_uuid: newRoomId
            });
        });


    });
}

function getLocalProducts(req, ret) {
    if (!req.body.pos) return ret.status(400).send({message: 'no pos send'});
    uberUtil.getProducts(req.body.pos, function (err, res) {
        if (err) {
            ret.status(400).send({message: err});
        } else {
            ret.status(200).send({message: res});
        }
    });
}

function getProductById(req, ret) {
    if (!req.body.product_id) return ret.status(400).send({message: 'product id not sent'});
    User.findOne({_id: req.body.user._id}, function(err, user) {
        uberUtil.getProduct(req.body.product_id, user.uber_access.access_token, function (err, res) {
            if (err) {
                ret.status(400).send({message: err});
            } else {
                ret.status(200).send({message: res});
            }
        });
    });
}

function getEstimatedPrice(req, ret) {
    if (!req.body.start_pos || !req.body.end_pos) return ret.status(400).send({message: 'location not sent'});
    uberUtil.getEstPrice(req.body.start_pos, req.body.end_pos, function (err, res) {
        if (err) {
            ret.status(400).send({message: err});
        } else {
            ret.status(200).send({message: res});
        }
    });
}

function requestRide(req, ret) {
    if (!req.body.start_pos || !req.body.end_pos || !req.body.product_id) return ret.status(400).send({message: 'ride information not sent'});
    User.findOne({_id: req.body.user._id}, function (err, user) {
        uberUtil.requestRide(req.body.start_pos, req.body.end_pos, req.body.product_id, user.uber_access.access_token, function (err, res) {
            if (err) {
                ret.status(400).send({message: err});
            } else {
                var request_id = res.request_id;
                // This is required while using the sandbox API
                uberUtil.acceptRequestedRide(request_id, function (err, accept_res) {
                    if (err) {
                        ret.status(400).send({message: err});
                    } else {
                        ret.status(200).send({message: res});
                    }
                });
            }
        });
    });
}

function getRequestedRide(req, ret) {
    if (!req.body.request_id) return ret.status(400).send({message: 'request id not sent'});
    User.findOne({_id: req.body.user._id}, function (err, user) {
        uberUtil.getRequestedRide(req.body.request_id, user.uber_access.access_token, function (err, res) {
            if (err) {
                ret.status(400).send({message: err});
            } else {
                ret.status(200).send({message: res});
            }
        });
    });
}

function patchRequestedRide(req, ret) {
    if (!req.body.request_id || !req.body.end_pos) return ret.status(400).send({message: 'patch information not sent'});
    User.findOne({_id: req.body.user._id}, function (err, user) {
        uberUtil.patchRequestedRide(req.body.request_id, req.body.end_pos, user.uber_access.access_token, function (err, res) {
            if (err) {
                ret.status(400).send({message: err});
            } else {
                ret.status(200).send({message: res});
            }
        });
    });
}

function deleteRequestedRide(req, ret) {
    if (!req.body.request_id) return ret.status(400).send({message: 'ride id not sent'});
    User.findOne({_id: req.body.user._id}, function (err, user) {
        uberUtil.deleteRequestedRide(req.body.request_id, user.uber_access.access_token, function (err, res) {
            if (err) {
                ret.status(400).send({message: err});
            } else {
                ret.status(200).send({message: res});
            }
        });
    });
}

function initRide(req, res) {

    var data = req.body;
    var newRide = new Ride();

    newRide.destination.lat = data.destination.lat;
    newRide.destination.lng = data.destination.lng;
    newRide.start_location.lat = data.start.latitude;
    newRide.start_location.lng = data.start.longitude;
    newRide.socket_io_room  = data.user.room_uuid;

    newRide.ride_users = _.map(data.friends, function(f){
       return {
           user_id: f.id,
           location:{
              lat: 0.0,
              lng: 0.0
           },
           phone: f.phoneNumber,
           paid: false,
           amount: 0.0,
           accepted:false
       }
    });

    newRide.save(function(err, rideRet){
       if( err ){
           res.status(400).send({
               message: err
           });
       } else {
            async.map(newRide.ride_users, function(u, cb){
                User.findById(u.user_id, function(err, user){
                    cb(null, user.push_token);
                });
            }, function(err, ret){

                pushUtil(ret, rideRet._id, data.user.username);

                res.status(200).send({
                   message:'Ride created waiting for response from friends'
                });
            });
       }
    });

}

function respondToRideRequest(req, res){
    var data = req.body;
    /*
    response: response,
    location: location,
    ride_id: ride_id,
    user: Authentication.user
    */
    console.log(data);
    if(data.response) {
        Ride.findById(data.ride_id, function (err, ride) {

            ride.ride_users.forEach(function (u) {
                if (u._id == data.user._id) {
                    u.accepted = true;
                    u.location = data.location;
                }
            });

            var idx = _.findIndex(ride.ride_users, function(u){ return u.user_id == data.user._id});
            ride.ride_users[idx].accepted = true;
            ride.ride_users[idx].location = data.location;

            console.log('Should be updated...');
            console.log(ride.ride_users);

            ride.save(function (err, savedRide) {
                if (!err) {
                    broadCastRideUpdate(ride.socket_io_room, savedRide);
                    addToRoom(ride.socket_io_room, data.user.socket_id);
                    res.status(200).send(savedRide);
                } else {
                    res.status(400).send(err)
                }
            });

        });
    } else {
        //TODO update user to delcined
        res.status(200).send({
           message:'OK!'
        });
    }
}

function broadCastRideUpdate(room_uuid, updatedRide){
    console.log('Sending update to: ', room_uuid);
    myIo.sockets.in(room_uuid).emit('ride_status', updatedRide);
}

function addToRoom(room_uuid, socket_id){
    var socket = myIo.sockets.connected[socket_id];
    if(socket){
       console.log('Joined!');
       socket.join(room_uuid);
    }
}

function checkFriend(req, res) {
    if (!req.body.friend) res.status(400).send({message: 'Friend not found'});

    var id = req.body.friend.id;
    var phone = id.replace(/[^0-9.]/g, '');

    User.findOne({$or: [{username: id}, {phoneNumber: phone}]}, function (err, user) {
        if(err) return res.status(400).send({message:err});

        if (user) {
            res.status(200).send({
                message: {
                    id: user._id,
                    name: user.username,
                    phoneNumber: user.phoneNumber,
                    status: 'KNOWN'
                }
            });
        } else {
            res.status(200).send({
                message: {
                    id: -1,
                    name: '',
                    phoneNumber: '',
                    status: 'UNKNOWN'
                }
            });
        }
    });
}


RideFormationController.prototype = {
    initRide: initRide,
    getLocalProducts: getLocalProducts,
    getProductById: getProductById,
    getEstimatedPrice: getEstimatedPrice,
    requestRide: requestRide,
    getRequestedRide: getRequestedRide,
    patchRequestedRide: patchRequestedRide,
    deleteRequestedRide: deleteRequestedRide,
    checkFriend: checkFriend,
    respondToRideRequest: respondToRideRequest,
    coreSockets: coreSockets
};

module.exports = new RideFormationController();


