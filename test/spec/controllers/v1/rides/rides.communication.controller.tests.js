
describe('RidesCommunicationController Tests', function() {

  var ride = {
    core:{
      server:{
        controller:{
          jsController:{}
        }
      }
    }
  };
  var req;
  var res;
  var next;
  var mongoose = require('mongoose');
  var assert = require('assert')

  beforeEach(function() {
    req = {};
    res = { status: function(code) { return { json: function(obj) {} }} };

    // sinon.spy(res, "status");

    mongoose.model('Ride', new mongoose.Schema());
    var rideModel = mongoose.model('Ride');
    mongoose.model('User', new mongoose.Schema());
    var userModel = mongoose.model('User');

    ride.core.server.controller.jsController = require('../../../../../app/controllers/v1/ride/ride.core.server.controller.js');
  });

  describe('sendMessage()', function() {

    it('should be a function', function(done) {
      assert(ride.core.server.controller.jsController.sendMessage).to.be.a('function');
      done();
    });

  });
});
