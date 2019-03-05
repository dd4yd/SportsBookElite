var mongoose = require('mongoose');
//require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var historySchema =  new mongoose.Schema ({
	totalBetsWon: { type: Number, default: 0, required: true },
	totalBetsLost: { type: Number, default: 0, required: true },
	totalWinnings: { type: Number, default: 0, required: true },
	totalLosings: { type: Number, default: 0, required: true },
	prevBets: [{ type: SchemaTypes.ObjectId, ref: 'PlacedBet', default: undefined }]
});

module.exports = mongoose.model('History', historySchema, 'History');
