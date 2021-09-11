var express = require('express');
var controller = require('./index.controller');
var auth = require('../../auth.service');
var router = express.Router();

router.get('/',controller.getiInfo);
router.put('/',auth.isAdmin(),controller.updatePaymentSetting);
router.get('/list/top-up',controller.getTopUp);
router.delete('/top-up/:id',auth.isAdmin(),controller.deletePackage);
router.put('/top-up',auth.isAdmin(),controller.updatePackage);
router.post('/ccbill/webhook', controller.newSaleSuccessWebHook);
// router.get('/me', auth.isAuthenticated(),controller.me);
// router.put('/me',auth.isAuthenticated(), controller.updateUser);
// router.get('/:id', auth.getDataLogin(),controller.getInfoUser);
// router.post('/login',controller.login);
// router.get('/all', controller.allUsers);
// router.put('/:id/subscribe',auth.isAuthenticated(), controller.subscribe );
module.exports = router;