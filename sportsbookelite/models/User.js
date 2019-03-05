const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const emailRegex = require('email-regex');
const moment = require('moment'); // For date formatting

var UserSchema = new Schema({
    email: {
        type: String,
        validate: { // Validate so only valid email addresses can be stored.
            validator: function(v) {
                return emailRegex({exact: true}).test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        },
        required: true,
		unique: true
    },
	password: { type: String, required: true },
	fname: String,
	lname: String,
	dob: { type: Date, required: true},
	balance: { type: Number, default: 0.0,  min: 0},
	ammountAtRisk: { type: Number,default: 0.0,  min: 0},
//	userType: { type: String, enum: ['admin', 'user'], default: 'user', required: true},
    openBets: [{ type: Schema.Types.ObjectId, ref: 'PlacedBet', default: undefined}],
    history: { type: Schema.Types.ObjectId, ref: 'History', required: true},
	address: {
		address: String,
		city: String,
		zip: Number, //todo: validate
		state: String //todo: enum?
	},
	//favoriteTeams (make a team object and then this an array of those?)
	//favoriteLeagues (ditto above but for leagues?)
});

UserSchema.virtual('name').get(function() {
	return (this.fname + ' ' + this.lname);
});

UserSchema.virtual('url').get(function() {
	return '/profile/' + this._id;
});

UserSchema.virtual('dob_formatted').get(function() {
	// e.g April 1st, 1993
	return moment(this.dob).format('MMMM Do, YYYY');
});

UserSchema.virtual('address_formatted').get(function() {
	// e.g 123 Main Street Albany, NY 12084
	return this.address.address + ' ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip;
});


// Export function to create model class
module.exports = mongoose.model('User', UserSchema, 'Users');
