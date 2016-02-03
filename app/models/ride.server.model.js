'use strict';
/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
crypto = require('crypto');

//possible validations:
var validateCost = function(cost){
	return (cost >= 0.00);
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
		default: ''
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
	//relevant_uber_info,
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
			default: ''
		},
		payed: { //possible statuses: paid/unpaid
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
