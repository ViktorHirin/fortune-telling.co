'use strict'
var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
router.get('/list-country',controller.getlistCountry);
router.get('/me',auth.isAuthenticated(),controller.getBank);
router.put('/update',auth.isAuthenticated(),controller.putBank);
module.exports = router;
