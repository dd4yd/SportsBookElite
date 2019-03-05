var express = require('express');
var router = express.Router();

var signupcontroller = require('../controllers/signupController');

router.get('/', signupcontroller.index_get);
router.post('/', signupcontroller.create_user);

module.exports = router;

