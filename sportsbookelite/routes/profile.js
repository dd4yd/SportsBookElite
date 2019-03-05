var express = require('express');
var router = express.Router();

var profile_controller = require('../controllers/profileController');

// PROFILE ROUTES //
router.get('/', profile_controller.index); // Requests to /profile/

router.get('/history', profile_controller.history);

router.get('/openbets', profile_controller.openBets);

router.get('/update', profile_controller.user_update_get);
router.post('/update', profile_controller.user_update_post);


// Helpful Dev Routes
router.get('/list', profile_controller.user_list);
router.get('/:id', profile_controller.user_detail);
router.get('/:id/delete', profile_controller.user_delete_get);
router.post('/:id/delete', profile_controller.user_delete_post);

module.exports = router;
