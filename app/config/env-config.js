/**
 *
 * Created by Matthias on 12/3/15.
 */

var _ = require('lodash'),
    glob = require('glob');

module.exports = _.extend(
  require('./env/all'),
  require('./env/' + process.env.NODE_ENV) || {}
);
