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
    uberUtil.getProducts(req.body.pos, function (err, ret) {
        if (err) {
            ret.status(400).send({message: err});
        } else {
            ret.status(200).send({message: ret});
        }
    })
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
    checkFriend: checkFriend,
    coreSockets: coreSockets
};

module.exports = new RideFormationController();


