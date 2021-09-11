'use strict'
var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.get('/',controller.getConfig);
router.put('/',[auth.isAdmin(),multipartMiddleware],controller.putConfig);
router.get('/seo',controller.getSeoConfig);
router.put('/seo',[auth.isAdmin(),multipartMiddleware],controller.putSeoConfig);
module.exports = router;