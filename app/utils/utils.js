/**
 *
 * Created by Matthias on 12/3/15.
 */

"use strict";

var _    = require('lodash'),
    glob = require('glob');

module.exports.getGlobbedFiles = function(globPatterns, removeRoot){
  // For context switching
  var _this = this;

  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function(globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {

      var files = glob(globPatterns, {sync:true});
      if(removeRoot){
        files = files.map(function(file){
          return file.replace(removeRoot, '')
        });
      }

      output = _.union(output, files);

    }
  }
  return output;
};
