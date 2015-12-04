/**
 * Contains the configuration for the express server
 * also starts the server
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routeConfig = require('./route-config');
var config = require('./env-config');
var cookieParser = require('cookie-parser');
var passport    = require('passport');
var utils = require('../utils/utils');
var path = require('path');
var session = require('express-session');
var chalk = require('chalk');
var mongoStore = require('connect-mongo')({
  session: session
});

module.exports = function(db) {
  var application = express();

  function configureWorker(application) {
    configureApplication(application);
    configureRoutes(application);
    startServer(application);
  }

  /*
   Express application configuration
   connects to db, loads mongodb modals. enables passport sessions
   */
  function configureApplication(application) {

    //load models
    utils.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
      require(path.resolve(modelPath));
    });

    application.use(bodyParser.urlencoded({
      extended: true
    }));

    application.use(bodyParser.json());

    //Used for sessions
    application.use(cookieParser());

    //Set up application session (allows users to stay logged in
    application.use(session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      store: new mongoStore({
        db: db.connection.db,
        collection: config.sessionCollection
      })
    }));

    //Use passport sessions for auth (can also configure google among others
    application.use(passport.initialize());
    application.use(passport.session());

    application.use(function (req, res, next) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.type('application/json');
      next();
    });

    //Bootstrap passport config
    require('./passport')();
  }

  /*
   Registers routes defined in ./app/config/routes
   */
  function configureRoutes(application) {
    routeConfig.registerRoutes(application);
  }


  /*
   Starts the server
   */
  function startServer(application) {
    var server = http.createServer(application);

    server.listen(
      config.port,
      function () {
        console.log('listening at %s', config.port);
      });
  }

  configureWorker(application);
};
