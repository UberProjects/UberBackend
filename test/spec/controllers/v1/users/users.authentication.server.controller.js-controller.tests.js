
describe('UsersAuthenticationServerControllerJsController Tests', function() {

  var users = {
    authentication:{
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

    sinon.spy(res, "status");

    users.authentication.server.controller.jsController = require('../../../../../app/controllers/v1/users/users.authorization.server.controller.js');
  });

  describe('put()', function() {

    it('should be a function', function(done) {
      expect(users.authentication.server.controller.jsController.put).to.be.a('function');
      done();
    });

    it('should call res.status() one time', function(done) {
      users.authentication.server.controller.jsController.put(req, res, next);

      expect(res.status.callCount).to.equal(1);
      done();
    });

    it('should call res.status() with 200', function(done) {
        users.authentication.server.controller.jsController.put(req, res, next);

      expect(res.status.calledWith(200)).to.equal(true);
      done();
    });

  });
});
