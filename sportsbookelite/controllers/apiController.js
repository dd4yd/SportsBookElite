var Event = require('../models/Event');
var User = require('../models/User');
var PlacedBet = require('../models/PlacedBet');

exports.index_get = function(req, res) {
	res.render('api_homepage');
}

exports.league = function(req, res) {
	Event.find({league: req.params.league.toUpperCase()}).exec(function(err, event) {
		if(err) {
			res.json({errNo: 404-3, errText: 'No Events found.'});
		}
		res.json(event);
	});
}

exports.leagueTeam = function(req, res) {
	Event.find({league: req.params.league.toUpperCase(), "$or": [{homeTeam: req.params.team},{awayTeam: req.params.team}]}).exec(function(err, event) {
		if(err) {
			res.json({errNo: 404-4, errText: 'No Events found.'});
		}
		res.json(event);
	});
}

exports.openBets = function(req, res) {
	if(!req.session.user) {
		res.json({errNo: 500, errText: 'No user is currently logged in.'});
	}
	User.findById(req.session.user._id, '-_id openBets').populate('openBets').exec(function (err, bets) {
		if(err) {
			res.json({errNo: 404-5, errText: 'No open bets for this user.'});
		}
		res.json(bets);
	});
}

exports.eventById = function(req, res) {
	Event.findById(req.params.eventID).exec(function(err, event) {
		if(err) {
			res.json({errNo: 404, errText: 'Event not found.'});	
		}
		res.json(event);
	});
}

exports.eventByApiId = function(req, res) {
	Event.find({apiId: req.params.apiID}).exec(function(err, event) {
		if(err) {
			res.json({errNo: 404-2, errText: 'Event not found.'});
		}
		res.json(event);
	});
}

