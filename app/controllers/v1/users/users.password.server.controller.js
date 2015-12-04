/*
  TODO logic taken from other project need
  to rework responses for cordova
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var config = require('../../../config/env-config');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

function UsersPasswordServerController() {

}

function forgot(req, res, next){
  async.waterfall([
    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function(token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username
        }, '-salt -password', function(err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function(token, user, done) {
      res.render('templates/reset-password-email', {
        name: user.displayName,
        appName: config.app.title,
        url: 'http://' + req.headers.host + '/auth/reset/' + token
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to ' + user.email + ' with further instructions.'
          });
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}

function validateResetToken(req, res, next){
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/password/reset/invalid');
    }

    res.redirect('/#!/password/reset/' + req.params.token);
  });
}

function reset(req, res, next){
// Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

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
                    // Return authenticated user
                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function(user, done) {
      res.render('templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}

function changePassword(strategy){
// Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function(err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

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
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}


UsersPasswordServerController.prototype = {
  forgot:forgot,
  validateResetToken:validateResetToken,
  reset:reset,
  changePassword:changePassword
};

module.exports = new UsersPasswordServerController();
