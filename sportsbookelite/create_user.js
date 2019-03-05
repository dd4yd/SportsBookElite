#! /usr/bin/env node

var mongoose = require('mongoose'); // Used to interact with our Mongo database
var User = require('./models/User');
var History = require('./models/History');
let db = require('./mongoDB/database');

//const mongoPath = 'mongodb://root:DTZ2sa4X8Tom@localhost/admin';
/*const mongoPath = 'mongodb://root:DTZ2sa4X8Tom@127.0.0.1:27017/mydb?authSource=admin'; 
//'mongodb://root:DTZ2sa4X8Tom@127.0.0.1:27017/mydb?authSource=admin' 
mongoose.connect(mongoPath, { useNewUrlParser: true }); // Initiate a connection to our database
mongoose.Promise = global.Promise; // Use the global promise library
const db = mongoose.connection; // Get default connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

function userCreate(email, password, fname, lname, balance, atr, dob, addr, city, zip, state) {
	userDetail = {
		email: email,
		password: password,
		fname: fname,
		lname: lname,
		balance: balance,
		ammountAtRisk: atr,
		dob: dob,
		//userType: userType,
		//language: language,
		history: createHistory(),
		address: {
			address: addr,
			city: city,
			zip: zip,
			state: state
		}
	}

	var user = new User(userDetail);
	user.save(function(err) {
		if(err) {
			console.log("Error saving user");
			console.log(err);
			return;
		}
		console.log(user);
	});
}

function createHistory() {
	var history = new History({});
	history.save(function(err) {
		if(err) {
			console.log("error saving user")
			console.log(err)
			return
		}
		console.log(history)
	})
	return history._id;
}


userCreate("123123@foo.net", "passw0rd", "Robert", "Ross", 9001, 10,"09/29/1996", "123 Main St.", "Hollywood", 90210, "CA") // Test user
