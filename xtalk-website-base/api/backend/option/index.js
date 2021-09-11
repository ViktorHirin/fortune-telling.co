'use strict'
var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
router.get('/all',auth.isAdmin(),controller.getAll);
router.put('/',auth.isAdmin(),controller.putOption)
module.exports = router;