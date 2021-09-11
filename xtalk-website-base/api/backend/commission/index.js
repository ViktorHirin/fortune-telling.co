'use strict'
var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
router.put('/',auth.isAdmin(),controller.setCommission)
module.exports = router;