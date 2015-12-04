/**
 *
 * Created by Matthias on 12/3/15.
 */

var glob = require('glob');

module.exports = function(){
  var envFiles = glob('./app/config/env/' + process.env.NODE_ENV + '.js', {sync:true});

  if (!envFiles.length) {
    if (process.env.NODE_ENV) {
      console.error('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
    } else {
      console.error('NODE_ENV is not defined! Using default development environment');
    }
    process.env.NODE_ENV = 'development';
  } else {
    console.log('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration');
  }
};
