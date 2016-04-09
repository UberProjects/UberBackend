/**
 *
 * Created by Cris on 4/9/16.
 */
var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');
var User = mongoose.model('User');


function RideCommunicationController() {
}

// Sets the client's username
function addUsertoRoom (req, ret) {

  var socketLoad = this.app.get('socketDeffer');

  socketLoad.promise.then(function(io){

    io.on('add user', function(socket){

      socket.in(req.Ride.socket_io_room).emit('user joined', {
        username : req.User.displayName
      });

    })
  });
}

// Sends a chat message
function sendMessage (req, ret) {

  function cleanInput (input) {
     return $('<div/>').text(input).text();
   }

  var message = req.inputMessage;
  // Prevent markup from being injected into the message
  message = cleanInput(message);

  var socketLoad = this.app.get('socketDeffer');

  socketLoad.promise.then(function(io){

    io.on('new message', function(socket){

      socket.in(req.Ride.socket_io_room).emit('new message', message);

    })
  });
}

function sendNotification(req, ret){
  var socketLoad = this.app.get('socketDeffer');

  socketLoad.promise.then(function(io){

    io.on('event', function(socket){

      socket.in(req.Ride.socket_io_room).emit('New Event', req.event);

    })
  });

}
