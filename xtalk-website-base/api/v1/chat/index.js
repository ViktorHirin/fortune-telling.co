var express = require('express');
var controller = require('./index.controller');
var router = express.Router();
var auth = require('../../auth.service');
router.get('/room/all',auth.isAuthenticated(), controller.allRoom);
router.get('/room/:id',auth.isAuthenticated(),controller.getRoomInfo);
router.get('/message/room/:id',auth.isAuthenticated(),controller.getMessage);
module.exports = router;