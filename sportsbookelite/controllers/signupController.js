let User = require('../models/User')
let History = require('../models/History')
let crypto = require('crypto')

exports.create_user = function(req, res) {
	
	let body = req.body

	if(!body.password || !body.confirm_password || !body.fname || !body.lname || !body.email || !body.dobm || !body.doby || !body.dobd) {
		res.render('signup_form', {err: "Not all required fields are filled"})
	}

	if(body.password != body.confirm_password){
		// Display not matching passwords
		res.render('signup_form', {err: "Passwords do not match"})
	}

	//try {
		let user = new User({
			email: body.email,
			password: crypto.createHash('sha256').update(body.password).digest('base64'),
			fname: body.fname,
			lname: body.lname,
			dob: body.dobm + '/' + body.dobd + '/' + body.doby,
			history: create_history()
		})
	
		user.save().then(function(){
			res.render('login_form')
		}).catch(function(err){
			if (err.name === 'MongoError'){
                if(err.code === 11000){
                    res.render('signup_form', {err: "Email already used"})
                }
			} else if (err.name === 'ValidationError') {
				if(err.errors.dob) {
					res.render('signup_form', {err: "Please input a valid date"})
				}
				if(err.errors.email){
					res.render('signup_form', {err: "Please input a valid email"})
				}
			} else {
				console.log(err.name)
			}
		})
}

exports.index_get = function (req, res) {

    res.render('signup_form')
}

function create_history() {
	var blank_history = new History()
	
    blank_history.save(function (err) {
        if(err) {
            console.log('Failed to save history')
            return -1 // Failed to create user history
        }
    })

	return blank_history._id
}
