/*

 */
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function UsersAuthorizationController() {

}

//Middleware function
function userById(req, res, next, id){
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
}

function requiresLogin(req, res, next){
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
}

function hasAuthorization(req, res, next){
  var _this = this;
  return function(req, res, next) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({
          message: 'User is not authorized'
        });
      }
    });
  };
}

//setup middleware function
//TODO possible better integrated into route-config
function postSetup(app){
   app.param('userId', userById);
}

UsersAuthorizationController.prototype = {
  userById:userById,
  requiresLogin:requiresLogin,
  hasAuthorization:hasAuthorization,
  posetSetup:postSetup
};


module.exports = new UsersAuthorizationController();
