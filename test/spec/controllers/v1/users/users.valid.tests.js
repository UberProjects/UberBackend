//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var today = new Date();

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://uber_api:uberdev@ds063134.mongolab.com:63134/uber_db';

describe('Valid Users Tests', function() {
	describe('Invalid user phone numbers', function(){
		it('Invalid users should not be saved to db', function(done){
			// Use connect method to connect to the Server
			MongoClient.connect(url, function (err, db) {
  				if (err) {
    				console.log('Unable to connect to the mongoDB server. Error:', err);
  				} else {
   				 	//HURRAY!! We are connected. :)
   					console.log('Connection established to', url);

   			 		// Get the users collection
    				var collection = db.collection('users');
					var user1 = {firstName: 'StefanInvalid1', lastName: 'Knott', displayName: 'StefanDN', email: 'stkn5801@colorado.edu', username: 'Stefan', password: 'adfadaaa', phoneNumber: '55-33', salt: 'no', provider: 'Verizon', providerData: '', additionalProvidersData: '', roles: ['user'], updated: today, created: today, resetPasswordToken: 'rst', resetPasswordExpires: today, savedRides: ['']};
					var user2 = {firstName: 'StefanInvalid2', lastName: 'Knott', displayName: 'StefanDN', email: 'stkn5801@colorado.edu', username: 'Stefan', password: 'adfadaaa', phoneNumber: '317-910-6685@', salt: 'no', provider: 'Verizon', providerData: '', additionalProvidersData: '', roles: ['user'], updated: today, created: today, resetPasswordToken: 'rst', resetPasswordExpires: today, savedRides: ['']};

				    // Insert some users
    				collection.insert([user1, user2], function (err, result) {
     					if (err) {
       						console.log(err);
      					} else {
        					console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      					}
    				});

        			collection.find({name: 'StefanInvalid1'}).toArray(function (err, result) {
      					if (err) {
        					console.log("success..we shouldnt have found")
      					} else {
      						throw user1
      					}
    				});
    				collection.find({name: 'StefanInvalid2'}).toArray(function (err, result) {
      					if (err) {
        					console.log("success..we shouldnt have found")
      					} else {
      						throw user2
      					}
      					//Close connection
      					db.close();
    				});
  				}
			});
		});
	});


	describe('Invalid user password lengths', function(){
		it('Invalid users should not be saved to db', function(done){
			// Use connect method to connect to the Server
			MongoClient.connect(url, function (err, db) {
  				if (err) {
    				console.log('Unable to connect to the mongoDB server. Error:', err);
  				} else {
   				 	//HURRAY!! We are connected. :)
   					console.log('Connection established to', url);

   			 		// Get the users collection
    				var collection = db.collection('users');
					var user1 = {firstName: 'StefanInvalid3', lastName: 'Knott', displayName: 'StefanDN', email: 'stkn5801@colorado.edu', username: 'Stefan', password: 'ad', phoneNumber: '555-555-5555', salt: 'no', provider: 'Verizon', providerData: '', additionalProvidersData: '', roles: ['user'], updated: today, created: today, resetPasswordToken: 'rst', resetPasswordExpires: today, savedRides: ['']};
					var user2 = {firstName: 'StefanInvalid4', lastName: 'Knott', displayName: 'StefanDN', email: 'stkn5801@colorado.edu', username: 'Stefan', password: '', phoneNumber: '317-910-6685', salt: 'no', provider: 'Verizon', providerData: '', additionalProvidersData: '', roles: ['user'], updated: today, created: today, resetPasswordToken: 'rst', resetPasswordExpires: today, savedRides: ['']};

    				// Insert some users
    				collection.insert([user1, user2], function (err, result) {
     					if (err) {
       						console.log(err);
      					} else {
        					console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      					}
    				});

        			collection.find({name: 'StefanInvalid3'}).toArray(function (err, result) {
      					if (err) {
        					console.log("success..we shouldnt have found")
      					} else {
      						throw user1
      					}
    				});
    				collection.find({name: 'StefanInvalid4'}).toArray(function (err, result) {
      					if (err) {
        					console.log("success..we shouldnt have found")
      					} else {
      						throw user2
      					}
      					//Close connection
      					db.close();
    				});
  				}
			});
		});
	});
});