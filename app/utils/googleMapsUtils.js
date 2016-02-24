/**
 *
 * Created by Matthias on 2/10/16.
 */

var GoogleMapsAPI = require('googlemaps');


var publicConifg = {
  key: process.env.GOOGLE_MAPS_KEY || 'AIzaSyC54BQZh1ODmeqbMXZ8NvuNTmiVymBz0oE&callback=',
  stagger_time : 1000,
  encode_polylines: false,
  secure: true
};

var gm = new GoogleMapsAPI(publicConifg);



module.exports.getBestRoute = function(dest, coords){

};
