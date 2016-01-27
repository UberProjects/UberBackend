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
}


/**
* Ride Schema
*/

var RideSchema = new Schema({
	requester: @user_db_reference,
	ride_state: {
		type: String,
		trim: true,
		default: ''
	},
	ride_est: {	//Estimate in USD, greater than or equal to 0
		type: Number,
		default:'0.00',
		validate: [validateCost, 'Cost cannot be below 0.00']
	},
	current_route:{
		type: Array[(Number, Number)]
	},
	updated:{
		type: Date
	},
	//relevant_uber_info,
	ride_users:[{
		user_id: @user_db_reference,
		location:{
			type: (Number, Number),
		}
		phone:
			type: String,
			trim: true,
			default: '555-555-5555'
		}
		payment_status: { //possible statuses: paid/unpaid
			type: String,
			trim: true
			default: 'unpaid'
		}
		amount:{ //greater than or equal to 0
			type: Number,
			default: '0.00',
			validate: [validateCost, 'Cost cannot be below 0.00']
		}
		accept_stats:{ //possible statuses: yes/no
			type: String,
			trim: true,
			default: "no"
		}
	}]
})