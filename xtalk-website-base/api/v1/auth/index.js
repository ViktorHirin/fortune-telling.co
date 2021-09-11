'use strict';
var express = require('express');
var config = require('../../../config/config');
const UserModel = require('../../../models/user.model');
var ReponseHelper = require("../../../helpers/ReponseHelper");
var HashDataHelper = require("../../../helpers/HashDataHelper");
var auth = require("../../auth.service");
var Validator=require('./validator');
var _ = require('lodash');
var crypto=require('crypto');
var EventBus = require('../../../components/EventBus');
// Passport Configuration
require('./local/passport').setup(UserModel, config);

var router = express.Router();

router.use('/local', require('./local'));

router.post('/forgot-password', function (req, res, next) {
    Validator.validateForgotPass(req, function (err, data) {
      if (err) {
          console.log('validator failed');
          console.log(err);
              return res.json(422, err);
          }
     
      UserModel.findOne({email:data.email}, function (err, user) {
        if (err) {
          console.log(err);
          return res.json(422, err);
        }
  
        if (!user) {
          return res.status(422).json(HashDataHelper.makeError({status:422,msg: 'This account doesn\'t exist .'}));
        }
        var now = new Date();
        var dataUpdate = {};
        //update password reset token
        var resetToken = crypto.randomBytes(6).toString('hex').substring(0, 6);
        dataUpdate.passwordResetToken = resetToken;
       // user.password = crypto.randomBytes(6).toString('hex').substring(0, 12);
        dataUpdate.passwordResetExpired = new Date(now.getFullYear(), now.getMonth(), now.getDate() +1);
              
              UserModel.update({_id: user._id}, dataUpdate, function (err) {
                  if (err) {
                      return res.status(422).json(HashDataHelper.makeError({status:422,error:err}));
                  }
                  //send recover email
                  var msg = 'An email has been sent to your email';
                   EventBus.emit('User.ForgotPassword', {
                      user: user,
                      resetToken: resetToken
                    });
                  return res.status(200).json(HashDataHelper.make({}));
              });
      });
    });  
  
    
  });
  
router.get('/verify-password-token/:token', function (req, res, next) {
  var now = new Date();
  UserModel.findOne({'passwordResetToken':req.params.token,passwordResetExpired:{$gte: now}})
    .exec(function (err, user) {
      if (err) {
        return res.status(422).json({msg: 'Unknown error'});
      }

      //account does not exist
      if (!user) {
          return ReponseHelper.response(res, 404, HashDataHelper.makeError({status: 404, mgs:'Your code is invalid or has expired.'}));
      }

                    return ReponseHelper.response(res, 200, HashDataHelper.make({status: 200}));
    });
});
  
router.post('/verify-password-reset/:token', function (req, res, next) {
  var now = new Date();
  UserModel.findOne({'passwordResetToken':req.params.token,passwordResetExpired:{$gte: now}})
    .exec(function (err, user) {
      if (err) {
        return res.status(422).json({msg: 'Unknown error'});
      }

      //account does not exist
      if (!user) {
        return ReponseHelper.response(res, 404, HashDataHelper.makeError({status: 404, mgs:'Your code is invalid or has expired.'}));
      }
      console.log('body');
      console.log(req.body);
      console.log('new passoword :'+req.body.newPassword);
      user.password = req.body.newPassword;
      user.passwordResetExpired = null;
      user.passwordResetToken = null;
      user.save(function(err,result){
      if (err) {
            return ReponseHelper.response(res, 404, HashDataHelper.makeError({status: 404, error:err}));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make({status: 200}));
          
      })
      
    });
});
 
router.get('/confirm-email/:token', function (req, res) {
    UserModel.findOne({
      emailVerifyToken: req.params.token,
     emailVerifyExpired:{$gte: new Date()}
    }).exec(function (err, user) {
      if (err || !user) {
          console.log('loi ko time htay' +err);        
          return res.redirect(config.fontendUrl +"/?message=Your code is invalid or has expired.&msgType=error");
  
      }
      
      //update token
      user.confirmEmail(function (err) {
        if (err) {
            console.log('err',err);
            return res.redirect(config.fontendUrl +"/?message='Something went wrong, please try again.&msgType=error");
          
        }
      var token = auth.signToken(user, 1);
  
      let data =user.toObject();
      data.token = token;
      data = _.omit(data, 'hashedPassword');
  
        //return ReponseHelper.response(res, 200, HashDataHelper.make(data));
        return res.redirect(config.fontendUrl +"/?message=Your account is activated.Please login to use our service&msgType=success");
      });
    });
  });

module.exports = router;