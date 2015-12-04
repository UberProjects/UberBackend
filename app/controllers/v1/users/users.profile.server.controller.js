/*

 */
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

function UsersProfileServerController() {

}

function update(req, res, next){
  // Init Variables
  var user = req.user;
  var message = null;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}

function me(req, res, next){
  res.json(req.user || null);
}

UsersProfileServerController.prototype = {
  update:update,
  me:me
};

module.exports = new UsersProfileServerController();
