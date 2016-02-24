/**
 *
 * Created by Matthias on 2/3/16.
 *
 */


/**
 * Created by Matthias on 12/3/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');


/**
 * Extend user's controller
 */
module.exports = _.assignIn(
  {
      loadApp: function(application){
        this.app = application;
      }
  },
  require('./ride.core.server.controller.js')
);
