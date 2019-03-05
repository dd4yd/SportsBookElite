const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bet = new Schema({
    betType: { type: String, enum: ['homemoneyline', 'awaymoneyline', 'over', 'under', 'homespread', 'awayspread'], required: true},
//  homeMoneyLineOdds: Number,
//  awayMoneyLineOdds: Number,
    odds: Number,
    overUnder: Number,
//  overOdds: Number
//  underOdds: Number,
    homeSpread: Number,
    awaySpread: Number,
//  awaySpreadOdds: Number,
//  homeSpreadOdds: Number,
    eventId: {type: Schema.Types.ObjectId, ref: 'Event', required: true }
})

var PlacedBetSchema = new Schema({
    //betType: [{ type: String, enum: ['homemoneyline', 'awaymoneyline', 'over', 'under', 'homespread', 'awayspread', required: true}],
	bets: [Bet],
	//eventId: [{ type: Schema.Types.ObjectId, ref: 'Event', required: true }],   
    amountAtRisk: { type: Number, min: 0.0, required: true },
    winAmount: { type: Number, min: 0.0, required: true },
    timeOfBet: { type: Date, default: Date.now },
    outcome: { type: String, enum: ['win', 'lose', 'push'] },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});


module.exports = mongoose.model('PlacedBet', PlacedBetSchema, 'PlacedBets');
