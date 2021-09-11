var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.post('/',[auth.isAuthenticated(),multipartMiddleware], controller.uploadFile);
module.exports = router;
