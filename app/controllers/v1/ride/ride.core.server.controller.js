/**
 *
 * Created by Matthias on 2/3/16.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');
var User = mongoose.model('User');
var passport = require('passport');
var uberUtil = require('../../../utils/uberUtil.js');
var utils = require('../../../utils/utils.js');
var listeners = {};

function RideFormationController() {
}

function coreSockets() {
    var socketLoad = this.app.get('socketDeffer');

    socketLoad.promise.then(function (io) {

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

    newRide.requester_id = data.requester_id;
    newRide.destination = data.destination;
    newRide.current_route = data.current_route;
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
                    name: user.username,
                    phoneNumber: user.phoneNumber,
                    status: 'KNOWN'
                }
            });
        } else {
            res.status(200).send({
                message: {
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
    coreSockets: coreSockets
};

module.exports = new RideFormationController();


