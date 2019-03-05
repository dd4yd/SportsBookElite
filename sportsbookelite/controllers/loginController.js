var User = require('../models/User');
var crypto = require('crypto');

exports.index_get = function(req, res) {
	if(req.session.user) { // User is already logged in
		res.redirect('back');
	}
	res.render('login_form');
}

exports.index_post = function(req, res) {
	if(!req.body.email || !req.body.password) {
		res.render('login_form', { err: "Email and password both required" });
	}	
	if(req.session.user) { // Don't allow manual POSTs to this page while logged in
		res.redirect('back');
	}

	User.find({ email: req.body.email }, function(err, docs) { 
		if(docs.length) { // A user with this email was found
			user = docs[0];
			if(user.password == crypto.createHash('sha256').update(req.body.password).digest('base64')) {
				req.session.user = user;
				res.redirect('/'); // Send user back to homepage
			} else {
				res.render('login_form', { err: "Incorrect password." });
			}
		} else {
			res.render('login_form', { err: "Email not found." });
		}
	});
}
