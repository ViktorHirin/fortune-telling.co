var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();

router.get('/',auth.isAuthenticated(),controller.getiInfo);
module.exports = router;