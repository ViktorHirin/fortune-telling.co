var express = require('express');
var controller = require('./index.controller');
var router = express.Router();
router.get('/all',controller.getAllPage);
router.get('/',controller.getStaticPage);
module.exports = router;