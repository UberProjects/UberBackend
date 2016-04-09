node-uber
=========
[![build status](https://img.shields.io/travis/shernshiou/node-uber.svg?style=flat-square)](https://travis-ci.org/shernshiou/node-uber) [![npm version](http://img.shields.io/npm/v/gh-badges.svg?style=flat-square)](https://npmjs.org/package/gh-badges) [![Dependency Status](https://david-dm.org/shernshiou/node-uber.svg?style=flat-square)](https://david-dm.org/shernshiou/node-uber)

A Node.js wrapper for Uber API


Version
-------
0.0.7 Support multiple scopes

0.0.6 Support User History v1.2

0.0.5 Support Promotions & Fixes oauth warning message

0.0.4 Mocha tests

0.0.3 Error handling

0.0.2 Support User Profile

0.0.1 Support Product Types, Time Estimates & Price Estimates

License
-------

MIT


Installation
------------

```sh
npm install node-uber
```

Test
------------

```sh
npm test
```

Usage
-----
```javascript
var Uber = require('node-uber');

var uber = new Uber({
  client_id: 'CLIENT_ID',
  client_secret: 'CLIENT_SECRET',
  server_token: 'SERVER_TOKEN',
  redirect_uri: 'REDIRECT URL',
  name: 'APP_NAME'
});
```

Resources / Endpoints
---------------------

### Authorization (OAuth 2.0)
#### Authrorize Url
After getting the authorize url, the user will be redirected to the redirect url with authorization code used in the next function.
```javascript
uber.getAuthorizeUrl(params);
```

##### Params
* scope (array)

_NOTE: `history` scope is still not working_

##### Example
```javascript
uber.getAuthorizeUrl(['profile']);
```
#### Authorization
Used to convert authorization code or refresh token into access token.
```javascript
uber.authorization(params, callback);
```
##### Params
* authorization_code OR
* refresh_token

##### Example
```javascript
uber.authorization({ refresh_token: 'REFRESH_TOKEN' }, 
  function (err, access_token, refresh_token) {
    if (err) console.error(err);
    else {
      console.log(access_token);
      console.log(refresh_token);
    }
  });

```

### Product
#### Types 
```javascript
uber.products.list(params, callback);
```
##### Params
* latitude
* longitude

##### Example
```javascript
uber.products.list({ latitude: 3.1357, longitude: 101.6880 }, function (err, res) {
  if (err) console.error(err);
  else console.log(res);
});
```

### Promotions
#### Lists
```javascript
uber.promotions.list(params, callback);
```

##### Params
* start_latitude
* start_longitude
* end_latitude
* end_longitude

##### Example
```javascript
uber.promotions.list({ 
  start_latitude: 3.1357, start_longitude: 101.6880, 
  end_latitude: 3.0833, end_longitude: 101.6500 
}, function (err, res) {
  if (err) console.error(err);
  else console.log(res);
});
```

### Estimates
#### Price
```javascript
uber.estimates.price(params, callback);
```
##### Params
* start_latitude
* start_longitude
* end_latitude
* end_longitude

##### Example
```javascript
uber.estimates.price({ 
  start_latitude: 3.1357, start_longitude: 101.6880, 
  end_latitude: 3.0833, end_longitude: 101.6500 
}, function (err, res) {
  if (err) console.error(err);
  else console.log(res);
});
```

#### Time
```javascript
uber.estimates.time(params, callback);
```
##### Params
* start_latitude
* start_longitude
* customer_uuid (not implemented)
* product_id (not implemented)

##### Example
```javascript
uber.estimates.time({ 
  start_latitude: 3.1357, start_longitude: 101.6880
}, function (err, res) {
  if (err) console.error(err);
  else console.log(res);
});
```

### User 
#### Activity
```javascript
uber.user.activity(params, callback);
```

##### Params
* access_token
* offset (defautls to 0)
* limit (defaults to 5, maximum 50)

##### Example
```javascript
uber.user.activity({
  access_token: 'ACCESS_TOKEN'
}, function (err, res) {
  if (err) console.log(err);
  else console.log(res);
});
```

#### Profile
```javascript
uber.user.profile(params, callback);
```

##### Params (optional)
* access_token

_If this params is unable, the object will try to retrieve `access_token` inside_

##### Example
```javascript
uber.user.profile(params, function (err, res) {
  if (err) console.log(err);
  else console.log(res);
});
```