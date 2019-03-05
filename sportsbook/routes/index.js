var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Yo this is Express',
    groupMembers : [
		{ fname : "Colin",
		  lname : "Stevens",
		  dob : Date(1996, 3, 22),
		  favNumber : 245,
		  likesNode: false
		},
		{ fname : "Matt",
		  lname : "Barber",
		  dob : Date(1901, 10, 16),
		  favNumber: 11,
		  likesNode: true
		},
		{ fname : "David",
		  lname : "Dean",
		  dob : Date(1776, 12, 24),
		  favNumber: 1945,
		  likesNode: false
		}
	]
  });
});

module.exports = router;
