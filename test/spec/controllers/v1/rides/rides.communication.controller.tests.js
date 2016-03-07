
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

  beforeEach(function() {
    req = {};
    res = { status: function(code) { return { json: function(obj) {} }} };

    // sinon.spy(res, "status");

    ride.core.server.controller.jsController = require('../../../../../app/controllers/v1/ride/ride.core.server.controller.js');
  });

  describe('put()', function() {

    it('should be a function', function(done) {
      expect(ride.core.server.controller.jsController.sendMessage).to.be.a('function');
      done();
    });

  });
});
