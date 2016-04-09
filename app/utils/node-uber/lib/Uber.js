var request = require('request')
  , qs = require('querystring')
  , OAuth = require('oauth');

var resources = {
  Estimates: require('./resources/Estimates'),
  Products: require('./resources/Products'),
  Promotions: require('./resources/Promotions'),
  User: require('./resources/User'),
  Requests: require('./resources/Requests')
};

function Uber(options) {
  this.sandbox = options.sandbox;
  this.defaults = {
    client_id: options.client_id,
    client_secret: options.client_secret,
    server_token: options.server_token,
    redirect_uri: options.redirect_uri,
    name: options.name,
    base_url: this.sandbox ? 'https://sandbox-api.uber.com/' : 'https://api.uber.com/',
    authorize_url: 'https://login.uber.com/oauth/authorize',
    access_token_url: 'https://login.uber.com/oauth/token'
  };

  this.oauth2 = new OAuth.OAuth2(
    this.defaults.client_id,
    this.defaults.client_secret,
    '',
    this.defaults.authorize_url,
    this.defaults.access_token_url
  );

  this.resources = resources;
  this.access_token = options.access_token;
  this.refresh_token = options.refresh_token;

  this._initResources();
}

module.exports = Uber;

Uber.prototype._initResources = function () {
  for (var name in this.resources) {
    this[name.toLowerCase()] = new resources[name](this);
  }
};

Uber.prototype.getAuthorizeUrl = function (scope, redirect_uri) {
  if (!Array.isArray(scope)) {
    return new Error('Scope is not an array');
  }
  if (scope.length === 0) {
    return new Error('Scope is empty');
  }
  if (redirect_uri) {
    this.defaults.redirect_uri = redirect_uri;
  }

  return this.oauth2.getAuthorizeUrl({
    'response_type': 'code',
    'redirect_uri': this.defaults.redirect_uri,
    'scope': scope.join(' ')
  });
};

Uber.prototype.authorization = function (options, callback) {
  var self = this
    , grantType = ''
    , code = '';
  if (options.hasOwnProperty('authorization_code')) {
    grantType ='authorization_code';
    code = options.authorization_code;
  } else if (options.hasOwnProperty('refresh_token')) {
    grantType ='refresh_token';
    code = options.refresh_token;
  } else {
    return callback(new Error('No authorization_code or refresh_token'));
  }

  this.oauth2.getOAuthAccessToken(code, {
    client_id: this.defaults.client_id,
    client_secret: this.defaults.client_secret,
    redirect_uri: this.defaults.redirect_uri,
    grant_type: grantType
  }, function (err, access_token, refresh_token) {
    if (err) {
      callback(err);
    } else {
      self.access_token = access_token;
      self.refresh_token = refresh_token;
      callback(null, self.access_token, self.refresh_token);
    }
  });

  return self;
};

Uber.prototype.post = function (options, callback) {
	return this.putPostHelper(options, callback, 'post');
};

Uber.prototype.put = function (options, callback) {
	return this.putPostHelper(options, callback, 'put');
};

Uber.prototype.delete = function (options, callback) {
    return this.putPostHelper(options, callback, 'delete');
};

Uber.prototype.patch = function (options, callback) {
    return this.putPostHelper(options, callback, 'patch');
};

Uber.prototype.putPostHelper = function(options, callback, method) {

  if (!options.version) {
    options.version = 'v1'
  }

  var url = this.defaults.base_url + options.version + '/' + options.url + '?'
    , accessToken = (this.access_token) ? this.access_token : null;

  if (!accessToken) {
    return callback(new Error('Invalid access token'));
  }

  var localCallback = function (err, data, res) {	  // shared callback between put and post requests
    if (err) {
      callback(err);
    } else {
      callback(null, res);
    }
  };

  var params = {
    url: url,
    json: true,
    headers: {
    	'Content-Type': 'application/json',
    	'Authorization' : 'Bearer '+accessToken
  	},
  	body : options.params
  };

  if ( method == 'post' ) {
  	request.post(params, localCallback);
  } else if ( method == 'put' ) {
      request.put(params, localCallback);
  } else if ( method == 'delete' ) {
      request.del(params, localCallback);
  } else if ( method == 'patch' ) {
    request.patch(params, localCallback);
  } else {
  	localCallback(new Error('Unrecognized HTTP Method'));
  }

  return this;
};

Uber.prototype.get = function (options, callback) {
  if (!options.version) {
    options.version = 'v1'
  }

  var url = this.defaults.base_url + options.version + '/' + options.url + '?'
    , accessToken = (options.access_token) ? options.access_token : null;

  if (!accessToken) {
    url += 'server_token=' + this.defaults.server_token;
  } else {
    url += 'access_token=' + accessToken;
  }

  if (options.params) {
    url += '&' + qs.stringify(options.params);
  }

  request.get({
    url: url,
    //auth: accessToken,
    json: true
  }, function (err, data, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, res);
    }
  });

  return this;
};
