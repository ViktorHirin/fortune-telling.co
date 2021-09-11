'use strict'
var express = require('express');
var controller=require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
router.post('/model',auth.isAuthenticated(),controller.createReview);
router.get('/model/:id',controller.getReview);
router.get('/all',auth.isAdmin(),controller.getAllReview);
// router.put('/me',auth.isAuthenticated(),multipartMiddleware, controller.updateReview);
router.get('/rating',auth.isAuthenticated(),controller.getRating);
router.post('/call',auth.isAuthenticated(),controller.postCallRating);

router.delete('/:id',auth.isAdmin(),controller.deleteReview);
module.exports = router;