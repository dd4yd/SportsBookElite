var mongoose = require('mongoose');
//require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var openBetSchema = new mongoose.Schema ({
	betType: { type: String, required: true },
	oddsType: { type: String, required: true},
	atRisk: { type: Number, required: true},
	amount: { type: Number, required: true},
	winAmount: { type: Number, required: true},
	eventIds: [
		{ type: String, required: true }
	],
	timeOfBet: {
        type: Date, 
        default: Date.now,
        required: true  
    },
	userId: { type: SchemaTypes.ObjectId, required: true }
    //outcome : { type: Number, default: 0, required: true }
});

module.exports = mongoose.model('OpenBet', openBetSchema, 'OpenBets');
