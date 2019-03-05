var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var User = require('../models/User');

exports.index = function(req, res) {
	if(!req.session.user) {
		res.redirect('/login');
		return;
	}
    User.findById(req.session.user._id).exec(function(err, user) {
        if(err) {
            var err = new Error('User not found.');
            err.status = 404;
            return next(err);
        }
		res.render('profile', {title: 'Profile Page', user: user});
	});
}

exports.history = function(req, res) {
	if(!req.session.user) {
		res.redirect('/login');
	}
	User.findById(req.session.user._id, '-_id history').populate('history').exec(function (err, history) {
		console.log(history);
		res.render('profile_history', { title: "Profile History", history: history.history});
	});
}

exports.openBets = function(req, res) {
	if(!req.session.user) {
		res.redirect('/login');
	}
	res.send('user open bets');
}


exports.user_update_get = function(req, res) { // Display User update form on GET request
    if(!req.session.user) {
		res.redirect('/login');
	}
	User.findById(req.session.user._id).exec(function(err, user) {
        if(err) {
            var err = new Error('User not found.');
            err.status = 404;
            return next(err);
        }
        res.render('profile_update', {user: user});
    });
}

exports.user_update_post = function(req, res) { // Handle User update on POST
	if(!req.session.user) {
		res.redirect('/login');
	}
	User.findById(req.session.user._id).exec(function(err, user) {
        if(err) {
            var err = new Error('User not found.');
            err.status = 404;
            return next(err);
        }
		
		user.email = (req.body.email != user.email ? req.body.email : user.email);
		user.fname = (req.body.fname != user.fname ? req.body.fname : user.fname);
		user.lname = (req.body.lname != user.lname ? req.body.lname : user.lname);
		user.address.address = (req.body.address != user.address.address ? req.body.address : user.address.address);
		user.address.city = (req.body.city != user.address.city ? req.body.city : user.address.city);
		user.address.state = (req.body.state != user.address.state ? req.body.state : user.address.state);
		user.address.zip = (req.body.zip != user.address.zip ? req.body.zip : user.address.zip);

		/*
		if(req.body.new_password) {
			if(user.password != crypto.createHash('sha256').update(req.body.current_password).digest('base64')) {
				// Error: current password incorrect
			}
			if(req.body.new_password != req.body.confirm_new_password) {
				// Error: new password and confirm password dont match
			}
			// Update password
		}
		*/

		// TODO: Convert string in date field to a Date object, then compare equivalence to Date object in User

		var renderMsg;
		user.save(function (err, user) {
			if(err) {
				renderMsg = "An error occured while saving profile changes.";
			} else {
				req.session.user = user; // Update user in session
				renderMsg = "Profile successfully saved.";				
			}
			res.render('profile_update', {msg: renderMsg, user: user});
		});
    });
}

// Development Routes
exports.user_list = function(req, res, next) {
	User.find({}, 'userType fname lname').exec(function(err, list_users) {
		if(err) {
			return next(err);
		}
		res.render('profile_list', {title: 'Profile List', user_list: list_users});
	});
}

exports.user_detail = function(req, res, next) { // Dislpay detail for a specific user
	User.findById(req.params.id).exec(function(err, user) {
		if(err) {
			var err = new Error('User not found.');
			err.status = 404;
			return next(err);
		}
		res.render('user_detail', {title: 'User Detail', user: user});
	});
/*
	async.parallel({
		user_info: function(callback) {
			User.findById(req.params.id).exec(callback);
		},
		// more model calls can go here.
	}, function(err, results) {
		if(err) {
			return next(err);
		}
		if(results.user_info == null) { // User not found
			var err = new Error('User not found.');
			err.status = 404;
			return next(err);
		}
		res.render('user_detail', { title: 'User Detail', user: user_info});
	});
*/
}

exports.user_delete_get = function(req, res) { // Display User delete form on GET
    res.send('user delete get'); //todo
}

exports.user_delete_post = function(req, res) { // Handle User delete on POST
    res.send('user delete post'); //todo
}


