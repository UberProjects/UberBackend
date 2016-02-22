var server = require('http').createServer();
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var io = require('socket.io')(server);
var User = mongoose.model('User');


// function CommunicationController(){
//   var socket = io();
// }

function addParticipantsMessage (data) {
  var message = '';
  if (data.numUsers === 1) {
    message += "there's 1 participant";
  } else {
    message += "there are " + data.numUsers + " participants";
  }
  log(message);
}

// Sets the client's username
function setUsername (socket, inputMessage) {

  var username = cleanInput(User.firstName);

  // If the username is valid
  if (username) {
    currentInput = inputMessage.focus();

    // Tell the server your username
    socket.emit('add user', username);
  }
}

// Sends a chat message
function sendMessage (username, connected, socket, inputMessage) {
  var message = inputMessage.val();
  // Prevent markup from being injected into the message
  message = cleanInput(message);
  // if there is a non-empty message and a socket connection
  if (message && connected) {
    inputMessage.val('');
    addChatMessage({
      username: username,
      message: message
    });
    // tell server to execute 'new message' and send along one parameter
    socket.emit('new message', message);
  }
}

// Adds the visual chat message to the message list
function addChatMessage (data, options) {
  // Don't fade the message in if there is an 'X was typing'
  var typingMessages = getTypingMessages(data);
  options = options || {};
  if (typingMessages.length !== 0) {
    options.fade = false;
    typingMessages.remove();
  }

  var $usernameDiv = $('<span class="username"/>')
    .text(data.username)
    .css('color', getUsernameColor(data.username));
  var $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message);

  var typingClass = data.typing ? 'typing' : '';
  var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .addClass(typingClass)
    .append($usernameDiv, $messageBodyDiv);

  addMessageElement($messageDiv, options);
}

// Adds the visual chat typing message
function addChatTyping (data) {
  data.typing = true;
  data.message = 'is typing';
  addChatMessage(data);
}

// Removes the visual chat typing message
function removeChatTyping (data) {
  getTypingMessages(data).fadeOut(function () {
    $(this).remove();
  });
}

// Updates the typing event
function updateTyping (connected, typing, socket) {
  if (connected) {
    if (!typing) {
      typing = true;
      socket.emit('typing');
    }
    var lastTypingTime = (new Date()).getTime();

    setTimeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= 400 && typing) {
        socket.emit('stop typing');
        typing = false;
      }
    }, 400);
  }
}

// Gets the 'X is typing' messages of a user
function getTypingMessages (data) {
  return $('.typing.message').filter(function (i) {
    return $(this).data('username') === data.username;
  });
}

// Gets the color of a username through our hash function
function getUsernameColor (username) {
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
     hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

function chat_server(req, res, next, socket){
  io.sockets.on('connection', function (socket) {
      console.log('socket connected');
      //when a client disconnects
      socket.on('disconnect', function () {
          console.log('socket disconnected');
      });
      // when the client emits 'new message', this listens and executes
      socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
      });
      // when the client emits 'add user', this listens and executes
      socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      });

      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      socket.emit('Test:', 'Testing Socket.io');
  });

  server.listen(3000);
}
