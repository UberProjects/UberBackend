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
module.exports = _.extend(
  require('./ride.communication.server.controller'),
  require('./ride.formation.controller'),
  require('./ride.history.server.controller'),
  require('./ride.state.server.controller')
);
