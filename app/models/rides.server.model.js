'use strict';
/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
crypto = require('crypto');
/**
* A Validation function for local strategy properties
*/
var validateLocalStrategyProperty = function(property) {
return ((this.provider !== 'local' && !this.updated) || property.length);
};