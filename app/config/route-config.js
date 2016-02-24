var config = require('./env-config');
var utils = require('../utils/utils');
var path = require('path');
var passport = require('passport');

function RouteConfig() {

}

function registerRoutes(application) {
  var config;
  utils.getGlobbedFiles('./app/config/routes/**/*.json').forEach(function (routeInfo) {

    config = require(path.resolve(routeInfo));

    if (!config.routes || config.routes.length === 0){

      console.error('No routes defined for: ' + routeInfo);

    }else{

      for(var i = 0, length = config.routes.length; i < length; i++) {
        var routeItem = config.routes[i];

        var controller = loadController(routeItem);
        var postItem = getIsPost(routeItem);
        var action = getAction(routeItem);

        if(!postItem){
          var method = getMethod(routeItem);
          var route = getRoute(routeItem);
          var authRequired = getAuth(routeItem);
          registerRoute(application, controller, route, method, action, authRequired);
        }else{
          controller[action](application);
        }
      }

    }

  });

  createConfigRoute(application);
}

function loadController(routeItem) {
  var controller;

  if(!routeItem || !routeItem.controller) {
    throw 'Undefined "controller" property in "lib/config/route.config.json"';
  }

  try {
    controller = require(routeItem.controller);
  }
  catch(e) {
      console.log(e);
    throw 'Unable to load ' + routeItem.controller + ": " + e;
  }

  return controller;
}

function getRoute(routeItem) {
  if(!routeItem || !routeItem.route || routeItem.route.length === 0) {
    throw 'Undefined or empty "route" property in "lib/config/route.config.json"';
  }

  return routeItem.route;
}

function getMethod(routeItem) {
  if(!routeItem || !routeItem.method || routeItem.method.length === 0) {
    throw 'Undefined or empty "method" property in "lib/config/route.config.json"';
  }

  var method = routeItem.method.toLowerCase();

  switch(method) {
    case 'get':
    case 'put':
    case 'post':
    case 'delete':
      return method;
      break;
    default:
      throw 'Invalid REST "method" property in "lib/config/route.config.json": ' + method;
  }
}

function getAction(routeItem) {
  if(!routeItem || !routeItem.action || routeItem.action.length === 0) {
    return getMethod(routeItem);
  }
  return routeItem.action;
}

function getAuth(routeItem){
  return !!(routeItem && routeItem.auth && routeItem.auth === "true");
}

function getIsPost(routeItem){
  return !!(routeItem && routeItem.post_setup && routeItem.post_setup == 'true');
}

function registerRoute(application, controller, route, method, action, authRequired) {
  if(authRequired){
     application.route(route)[method](passport.authenticate('session'), function (req, res, next) {
      controller[action](req, res, next);
    });
  }
  else {
    application.route(route)[method](function (req, res, next) {
      controller[action](req, res, next);
    });
  }
}

function createConfigRoute(application) {
  application.route('/config').get(function(req, res, next) {
    res.status(200).json(config.app);
  });
}

RouteConfig.prototype = {
  registerRoutes: registerRoutes
};

var routeConfig = new RouteConfig();

module.exports = routeConfig;
