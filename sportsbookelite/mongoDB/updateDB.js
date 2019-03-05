const Mongoose = require('mongoose')
const DB = require('./database')
const Event = require('../models/Event')
const PlacedBet = require('../models/PlacedBet')
const User = require('../models/User')
const History = require('../models/History')
const API = require('./getJSONOdds')
const async = require('async')
Mongoose.set('useFindAndModify', false);
Mongoose.set('useCreateIndex', true)

function get_events(){
	
	var games = []
	API.getTestOdds().then(json => {

		for(var i = 0; i < json.length; i++){
			if(get_sport(json[i].Sport) == "None"){
				continue;
			}

			for(var j = 0; j < json[i].Odds.length; j++){
				if (json[i].Odds[j].OddType == "Game"){

					insert_game(new Event({
						apiId: json[i].ID,
						homeTeam: json[i].HomeTeam,
						awayTeam: json[i].AwayTeam,
						homeSpread: json[i].Odds[j].PointSpreadHome,
						awaySpread: json[i].Odds[j].PointSpreadAway,
						homeSpreadOdds: json[i].Odds[j].PointSpreadHomeLine,
						awaySpreadOdds: json[i].Odds[j].PointSpreadAwayLine,
						homeMoneyline: json[i].Odds[j].MoneyLineHome,
						awayMoneyline: json[i].Odds[j].MoneyLineAway,
						timeOfEvent: json[i].MatchTime,
						league: get_sport(json[i].Sport),
						overUnder: json[i].Odds[j].TotalNumber,
						overOdds: json[i].Odds[j].OverLine,
						underOdds: json[i].Odds[j].UnderLine
					}))
				}
			}
		}

	})
}

function insert_game(game){

	Event.findOneAndUpdate(
		{apiId: game.apiId},
		{
			homeTeam: game.homeTeam,
			awayTeam: game.awayTeam,
			league: game.league,
			homeSpread: game.homeSpread,
			awaySpread: game.awaySpread,
			homeSpreadOdds: game.homeSpreadOdds,
			awaySpreadOdds: game.awaySpreadOdds,
			homeMoneyline: game.homeMoneyline,
			awayMoneyline: game.awayMoneyline,
			timeOfEvent: game.timeOfEvent,
			overUnder: game.overUnder,	
			overOdds: game.overOdds,
			underOdds: game.underOdds
		},
		{upsert: true, new: true, runValidators: true},
		function (err, doc) {
			if (err) {
				console.log(err)
			} else {
				//console.log(doc)
			}
		}
	)
}

function insert_result(apiId, home, away){

	Event.updateOne(
		{apiId: apiId},
		{$set:{
			homeScore: home,
			awayScore: away,
			finished: true
		}},
		{new: true, runValidators: true},
		function (err, doc){
			if (err) {
//				console.log(err)
			} else {
//				console.log(doc)
				if (doc) {
					update_placed_bets(doc._id)
				}
			}	
		}
	)
}

async function update_placed_bets(evendId){

	var users = await User.find()
	for(var i = 0; i < users.length; i++){
		let user = users[i]
		for(var j = 0; j < user.openBets.length; j++){
			let placedbet = await PlacedBet.findById(user.openBets[j])
			var winnings = placedbet.winAmount + placedbet.amountAtRisk
            var result = ""
            for(var k = 0; k < placedbet.bets.length; k++){
				let bet = placedbet.bets[k]
				x = await bet_result(bet)
					
				if(x == 0){
					winnings *= decimal_odds(bet.odds)
					continue
				}

				if(x == -1){
					winnings = 0
					result = "lose"
					break;
				}

				if(x == -2){
					break
				}
			}

			if(result == "")
				return;
		
			if(result != "lose"){
				if(winnings == placedbet.amountAtRisk)
					result = "push"
				else
					result = "win"
			}

			let user_history = await History.findById(user.history)
			
			PlacedBet.findOneAndUpdate({_id: placedbet._id}, {$set:{outcome: result}}, {new: true, runValidators: true}, function(err, bet) {})
			
			User.findOneAndUpdate({_id: user._id}, {$set:{amountAtRisk: user.amountAtRisk - placedbet.amountAtRisk, balance: user.balance + winnings}, 
				$pop:{openBets: -1}}, {new: true, runValidators: true}, function(err, bet) {})

			switch(result) {
				case "lose":
					History.findOneAndUpdate({_id: user.history}, 
						{$set:{totalBetsLost: user_history.totalBetsLost + 1, totalLosings: user_history.totalLosings + placedbet.amountAtRisk}, 
						$push:{prevBets: placedbet._id}}, {new: true, runValidators: true}, function(err, bet) {})
					break;

				case "win":
					History.findOneAndUpdate({_id: user.history}, 
						{$set:{totalBetsWon: user_history.totalBetsWon + 1, totalWinnings: winnings - placedbet.amountAtRisk},
						$push:{prevBets: placedbet._id}}, {new: true, runValidators: true}, function(err, bet) {})
					break;
				case "push":
					History.findOneAndUpdate({_id: user.history},
						{$set:{totalBetsWon: user_history.totalBetsPushed + 1},
						$push:{prevBets: placedbet._id}}, {new: true, runValidators: true}, function(err, bet) {})
					break;
				default:
					break;
					

			}
		}
	}
}
	

async function bet_result(bet) {

	game = await Event.findById(bet.eventId)
	return eval_bet(bet, game)
}

function eval_bet(bet, game){

		if (!game.finished)
			return -2
		
		switch (bet.betType) {
			
			case 'homemoneyline':
				if (game.homeScore > game.awayScore)
					return 1
				else
					return -1
			case 'awaymoneyline':
				if (game.homeScore < game.awayScore)
                    return 1
                else
                    return -1
			case 'over':
				if (game.homeScore + game.awayScore > bet.overUnder)
					return 1
				else if (game.homeScore + game.awayScore < bet.overUnder)
					return -1
				else
					return 0
			case 'under':
				if (game.homeScore + game.awayScore > bet.overUnder)
                    return -1
                if (game.homeScore + game.awayScore < bet.overUnder)
                    return 1
                else
                    return 0
			case 'homespread':
				if (bet.homeSpread < 0) {
					if (game.homeScore - game.awayScore > -bet.homeSpread)
						return 1
					if (game.homeScore - game.awayScore < -bet.homeSpread)
						return -1
					else 
						return 0	
				} else {
					if (game.awayScore - game.homeScore < bet.homeSpread)
						return 1
					if (game.awayScore - game.homeScore > bet.homeSpread)
						return -1
					else
						return 0
				}
			case 'awayspread':
				if (bet.awaySpread > 0) {
                    if (game.homeScore - game.awayScore < bet.awaySpread)
                        return 1
                    if (game.homeScore - game.awayScore > bet.awaySpread)
                        return -1
                    else
                        return 0
                } else {
                    if (game.awayScore - game.homeScore > -bet.awaySpread)
                        return 1
                    if (game.awayScore - game.homeScore < -bet.awaySpread)
                        return -1
                    else
                      return 0
                }

			default:
				return -2
		}
}

function decimal_odds(odds){
	
	if(odds < 0) {
		return (-odds)/((-odds)+100)
	} else {
		return 100 / (odds + 100)
	}
}

function get_sport(num){
	switch(num){
		case 1:
			return "NBA";
		case 2:
			return "CBB"
		case 3:
			return "CFB";
		case 4:
			return "NFL";
		case 5:
			return "NHL";
		case 6:
			return "MLB";
		case 7:
			return "Soccer";
		case 9:
			return "Tennis";
		case 10:
			return "Boxing";
		case 11:
			return "UFC";
		default:
			return "None";
	}
}

function get_results(){
	
	API.getTestResults().then(json => {
		for(var i = 0; i < json.length; i++) {
			if(json[i].OddType == "Game") {
				if(json[i].FinalType == "Finished") {
					insert_result(json[i].EventID, json[i].HomeScore, json[i].AwayScore)
				}
				if(json[i].FinalType == "Cancelled") {
					
				}
			}
		}
	})
}

//get_events()
//get_results()
insert_result("0b042651-ff7d-439b-8eb7-c9358c265d41", 30, 20)
//insert_result("e83bf033-dbde-49ac-a073-d385ebdc66d1", 30, 23)
