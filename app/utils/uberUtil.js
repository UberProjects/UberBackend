/**
 *
 * Created by Matthias on 2/10/16.
 */

var Uber = require('node-uber');
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

module.exports.getProduct = function(product_id, cb) {
    var params = {
        url: "products/" + product_id
    };
    uber.get(params, cb);
};

//IDK why uber is sending me acces_toens instead of authorization tokens
module.exports.getAuth = function(uber_info, cb){
    console.log(uber_info);
    uber.authorization(uber_info.access_token, function(err, access_token){
        console.log('Access Token: ' + JSON.stringify(access_token));
       cb(err, access_token);
    });
};


//TODO add refresh token
