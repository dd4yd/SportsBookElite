var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;

var eventSchema =  new mongoose.Schema ({
        //_id: { type: SchemaTypes.ObjectId, required: true },
        apiId: { type: String, unique: true, required: true},
        homeTeam: { type: String, required: true },
        awayTeam: { type: String, required: true },
        homeSpread: { type: Number, required: true },
        homeSpreadOdds: { type: Number, required: true },
        homeMoneyline: { type: Number, required: true },
        awaySpread: { type: Number, required: true },
        awaySpreadOdds: { type: Number, required: true },
        awayMoneyline: { type: Number, required: true },
        oddsLastUpdated: { type: Date, default: Date.now, required: true},
        timeOfEvent: {
                type: Date, 
                default: Date.now,
                required: true  
        },
        league: { type: String, required: true},
//      sport: { type: String, required: true},
        overUnder: { type: Number, required: true},
        overOdds: { type: Number, required: true },
        underOdds: { type: Number, required: true },
        homeScore: { type: Number },
        awayScore: { type: Number },
		finished: {type: Boolean, default: false, required: true}
});


module.exports = mongoose.model('Event', eventSchema, 'Events')
