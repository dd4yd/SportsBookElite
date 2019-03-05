var express = require('express');
var router = express.Router();

var login_controller = require('../controllers/loginController');

router.get('/', login_controller.index_get); // Requests to /login
router.post('/', login_controller.index_post); // POST (form) requests to /login

module.exports = router;
