'use strict'
var express = require('express');
var controller = require('./index.controller');
var router = express.Router();
router.get('/',controller.getOption);

module.exports = router;