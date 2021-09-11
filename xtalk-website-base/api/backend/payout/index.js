var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.get('/',auth.isAdmin(), controller.getPayout);
router.get('/detail/:id',auth.isAdmin(),controller.getDetail)
module.exports = router;