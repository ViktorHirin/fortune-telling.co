var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();

router.get('/all',auth.isAuthenticated(),controller.getAll);
router.get('/blance',auth.isAuthenticated(),controller.getBlance);
router.post('/add',auth.isAuthenticated(),controller.addNew);
router.put('/approved',auth.isAdmin(),controller.approved);
router.put('/reject',auth.isAdmin(),controller.reject);
router.put('/delete',auth.isAdmin(),controller.delete);
router.get('/dashboard/all',auth.isAdmin(),controller.dashboardAll);
module.exports = router;