/**
 *
 * Created by Matthias on 2/10/16.
 */

var Uber = require('./node-uber/lib/Uber');
var config = require('../config/env-config');
var uber = new Uber(config.uber_info);

module.exports.getEstPrice = function(start_pos, end_pos, cb){
    var params = {
        start_latitude:  start_pos['lat'],
        start_longitude: start_pos['long'],
        end_latitude:    end_pos['lat'],
        end_longitude:   end_pos['long']
    };
    uber.estimates.price(params, cb);
};

module.exports.getProducts = function(coords, cb){
    uber.products.list(coords, cb);
};

module.exports.getProduct = function(product_id, access_token, cb) {
    var params = {
        url: "products/" + product_id,
        access_token: access_token
    };
    uber.get(params, cb);
};

module.exports.requestRide = function(start_pos, end_pos, product_id, access_token, cb) {
    var request_body = {
        start_latitude:  start_pos['lat'],
        start_longitude: start_pos['long'],
        end_latitude:    end_pos['lat'],
        end_longitude:   end_pos['long'],
        product_id: product_id
    };
    var params = {
        url: "requests",
        params: request_body
    };
    uber.access_token = access_token;
    uber.post(params, cb);
};

module.exports.getRequestedRide = function(request_id, access_token, cb) {
    var params = {
        url: "requests/" + request_id,
        access_token: access_token
    };
    uber.get(params, cb);
};

module.exports.acceptRequestedRide = function(request_id, cb) {
    var params = {
        version: "v1/sandbox",
        url: "requests/" + request_id,
        params: { status: "accepted" }
    };
    uber.put(params, cb);
};

module.exports.patchRequestedRide = function(request_id, end_pos, access_token, cb) {
    var request_body = {
        end_latitude: end_pos['lat'],
        end_longitude: end_pos['long']
    };
    var params = {
        url: "requests/" + request_id,
        access_token: access_token,
        params: request_body
    };
    uber.patch(params, cb);
};

module.exports.deleteRequestedRide = function(request_id, access_token, cb) {
    var params = {
        url: "requests/" + request_id,
        access_token: access_token
    };
    uber.delete(params, cb);
};

//IDK why uber is sending me acces_toens instead of authorization tokens
module.exports.getAuth = function(authorization_code, cb){
    uber.authorization({authorization_code: authorization_code}, function(err, access_token, refresh_token){
        cb(err, access_token, refresh_token);
    });
};


//TODO add refresh token
