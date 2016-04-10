/**
 *
 * Created by Matthias on 4/10/16.
 */

var http = require('https');

module.exports = function(users, ride_id, requester){
    var options = {
        hostname:'api.ionic.io',
        method:'POST',
        path:'/push/notifications',
        headers:{
            'Authorization': process.env.IONIC_PUSH,
            'Content-Type': 'application/json'
        }
    };

    var req = http.request(options, function(res){
       res.setEncoding('utf8');
       res.on('data', function(body){
          console.log(body);
       });

       res.on('error', function(error){
           console.log(error);
       });
    });

    req.write(JSON.stringify({
       'tokens': users ,
       'profile':'ride_request',
       'notification':{
            'message': JSON.stringify({
                'payload': {
                   'ride_id': ride_id,
                   'requester': requester
                }
            }),
            'android':{
                'message': JSON.stringify({
                    'payload': {
                       'ride_id': ride_id,
                       'requester': requester
                    }
                }),
                'payload': {
                   'ride_id': ride_id,
                   'requester': requester
                }
            },
            'ios':{
                'message': JSON.stringify({
                    'payload': {
                       'ride_id': ride_id,
                       'requester': requester
                    }
                }),
                'payload': {
                   'ride_id': ride_id,
                   'requester': requester
                }
            }
       }
    }));

    req.end();
};
