const express = require('express'),
	router = express.Router(),
	firebaseController = require('../controllers/firebaseController');

router.get('/user/:userId', function(req, res) {
	res.send(firebaseController.getUser(req.params.userId));
});