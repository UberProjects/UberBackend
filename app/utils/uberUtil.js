/**
 *
 * Created by Matthias on 2/10/16.
 */

var Uber = require('node-uber');

var uber = new Uber({
  client_id: 'F23Rp_lYXaXkZr_XLFbghHRlNh92ILKk',
  client_secret:'1KzAUC1vvIGc2PnAYsyYvVu2qzhgbHIuiJmFJPXi',
  server_token:'5p-mn8J39yBkcSPM_BF-jQU5eI7beyRyLIeBA75A',
  redirect_uri:'http://localhost/callback',
  name:'RideWithFriendsCU'
});

module.exports.getEst = function(start, end){

};

module.exports.getProducts = function(coords, cb){
    uber.products.list(coords, cb);
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
