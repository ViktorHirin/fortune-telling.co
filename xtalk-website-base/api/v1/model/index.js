var express = require('express');
var controller = require('./index.controller');
var router = express.Router();
var auth = require('../../auth.service');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.get('/', controller.getAllModels);
router.get('/all', controller.allModel);
router.get('/search',controller.getSearch);
router.get('/:id',controller.getModelInfo);
router.put('/audio',[auth.isAuthenticated(),multipartMiddleware],controller.putAudio);
router.put('/admin/audio',[auth.isAdmin(),multipartMiddleware],controller.putAudiobyAdmin);
module.exports = router;