'use strict';
/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
crypto = require('crypto');

//Matches US and international
var phoneReg = new RegExp("^([+]?([0-9]*[\\.\\s\\-\\(\\)]|[0-9]+){3,24})$");

//possible validations:
var validateCost = function(cost){
	return (cost >= 0.00);
};

var validatePhone = function(number){
	return (phoneReg.test(number));
};

var validateState = function(state){
	return (state == "Forming" || state == "In Progress" || state == "Completed");
};

/**
* Ride Schema
*/

var RideSchema = new Schema({
	requester_id:{
    type: 'ObjectId'
    },
	ride_state: {
		type: String,
		trim: true,
		default: '',
		validate: [validateState, 'Not in a valid state']
	},
	ride_est: {	//Estimate in USD, greater than or equal to 0
		type: Number,
		default: 0.00,
		validate: [validateCost, 'Cost cannot be below 0.00']
	},
	current_route:[{
      lat: Number,
      lng: Number
   }],
	updated:{
		type: Date
	},
	uber_id:{
		type: String
	},
	ride_users:[{
		user_id:{
      		type: 'ObjectId'
   		},
		location:[{
      		lat: Number,
      		lng: Number
    	}],
		phone:{
			type: String,
			trim: true,
			default: '555-555-5555',
			validate: [validatePhone, 'Enter a valid phone number']
		},
		paid: { //possible statuses: paid/unpaid
    		type: Boolean,
			default: false
		},
		amount:{ //greater than or equal to 0
			type: Number,
			default: '0.00',
			validate: [validateCost, 'Cost cannot be below 0.00']
		},
		accepted:{ //possible statuses: yes/no
			type: Boolean,
			default: false
		}
	}]
});

mongoose.model('Ride', RideSchema);
