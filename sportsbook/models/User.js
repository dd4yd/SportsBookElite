var Mongoose = require('mongoose');
var SchemaTypes = Mongoose.Schema.Types;
//var crypto = require('crypto');

var userSchema = new Mongoose.Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, unique: true, required: true },
	balance: { type: Number, default: 0.0, required: true },
	amountAtRisk: { type: Number, default: 0.0, required: true },
	language: { type: String, default: 'en' },
	openBets: [
		{ type: SchemaTypes.ObjectId, ref: 'PlacedBet', default: undefined }
	],
	history: { type: SchemaTypes.ObjectId, ref: 'History', required: true },
	favoriteTeams: [
		{ type: String, default: undefined }
	],
	favoriteLeagues: [
		{ type: String, default: undefined }
	]
});

module.exports = Mongoose.model('User', userSchema, 'Users')
