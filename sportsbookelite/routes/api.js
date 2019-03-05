var express = require('express');
var router = express.Router();

var api_controller = require('../controllers/apiController');

// API ROUTES //
router.get('/', api_controller.index_get);
router.get('/league/:league', api_controller.league);
router.get('/league/:league/team/:team', api_controller.leagueTeam);
router.get('/openbets', api_controller.openBets);
router.get('/by-id/:eventID', api_controller.eventById);
router.get('/by-api-id/:apiID', api_controller.eventByApiId);

/*
router.get('/:id/delete', profile_controller.user_delete_get);
router.post('/:id/delete', profile_controller.user_delete_post);
*/

module.exports = router;
