var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();

router.get('/reports',auth.isAdmin(),controller.getReports);
router.get('/',auth.isAdmin(),controller.getInfo);
module.exports=router;