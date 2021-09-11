'use strict'
var _ = require('lodash');
// var ReviewValidator = require('./validators.js');
var async =require('async');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var OrderModel=require("../../../models/orderhistory.model");
var PaymentSettingModel = require('../../../models/paymentSetting.model');
var UserModel=require('../../../models/user.model');
var TopUp = require('../../../models/topup.model');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');
const { result } = require('lodash');
var authService = require('../../auth.service');
exports.getiInfo= function (req,res){
    PaymentSettingModel.findOne({},function (err,result){
        if(err){
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        }
        const data=result.toObject();
        
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
        
    });
}
exports.getTopUp =(req,res)=>{
    TopUp.find({},(err,result)=>{
        if(err){
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
          }
          return ReponseHelper.response(res, 200, HashDataHelper.make(result));
    });
    
}

exports.newSaleSuccessWebHook = (req,res)=>{
   console.log(req.query);
    writeLogPayment(req,res,(file,req,res)=>{
      async.waterfall([(done)=>{
        UserModel.findOne({_id:req.body['X-user_id']},(error,userModel)=>{
          if(error)
          {
              done(error.message);
              return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
          }
          done(null,userModel);
      });
      },(userModel,done)=>{
        TopUp.findOne({_id:req.body['X-topupId']},(errTopUp,topupModel)=>{
          if(errTopUp){
              return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
            }
          if(req.query.eventType == 'NewSaleSuccess')
          {
            userModel.token=userModel.token+topupModel.token;
            userModel.save((err,data)=>{
                if(err){
                    done(err.message);
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                }
                done(null,userModel,topupModel);
            });
          }
          else
          {
            done(null,userModel,topupModel);
          }
         
           
      });
      },
      (userModel,topDocs,done)=>{
         var order= new OrderModel();
         order.logFile=file._id;
         order.token=topDocs.token;
         order.topUp=topDocs.id;
         order.userId=userModel.id;
         order.status=req.query.eventType;
         order.save((err,orderDocs)=>{
           if(err)
           {
            done(err.message);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err.message}));
           }
           return ReponseHelper.response(res, 200, HashDataHelper.make({data:order._id,status:true}));
         });
      }]
      ,(err)=>{
        console.log(err);
        
      })
})
}

exports.updatePaymentSetting = (req,res)=>{
  console.log(req.body.paymentSetting);
  if(req.body.paymentSetting){
    PaymentSettingModel.findById({_id:req.body.paymentSetting._id},(err,paymentSetting)=>{
      if(err){
        return ReponseHelper.response(res, 422, HashDataHelper.makeError(err));
      }
      else{
        if(paymentSetting){
         var myquery = { _id: paymentSetting._id };  
             var newvalues = { $set: {
               name:req.body.paymentSetting.name,
               shortname:req.body.paymentSetting.shortname,
               description:req.body.paymentSetting.description,
               accountNumber:req.body.paymentSetting.accountNumber,
               subAccount:req.body.paymentSetting.subAccount,
               currencyCode:req.body.paymentSetting.currencyCode,
             } };  
          console.log(newvalues);

             PaymentSettingModel.findByIdAndUpdate(paymentSetting._id , newvalues, function(err, data) {  
                 if (err){
                   var errMsg={
                     message:"Error when update payment-settings",
                     type:'error'
                   }
                   console.log(err); 
                   return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                 }  
                 return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                 
             });  
        }
      }
    })
  }

}

exports.updatePackage=(req,res)=>{
  if(req.body.package && req.body.package._id)
  {
    TopUp.findById({_id:req.body.package._id},(err,topUp)=>{
      if(err){
        return ReponseHelper.response(res, 422, HashDataHelper.makeError(err));
      }
      else{
        if(topUp){
         var myquery = { _id: topUp._id };  
             var newvalues = { $set: {
               name:req.body.package.name,
               price:req.body.package.price,
               token:req.body.package.token,
               flexformId:req.body.package.flexformId,
               description:req.body.package.description,
             } };  
             TopUp.findByIdAndUpdate(topUp._id , newvalues, function(err, data) {  
                 if (err){
                   var errMsg={
                     message:"Error when update payment-settings",
                     type:'error'
                   }
                   console.log(err); 
                   return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                 }  
                 return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                 
             });  
        }
      }
    })
  }
  else
  {
    var topUp=new TopUp({
      name:req.body.package.name,
      price:req.body.package.price,
      token:req.body.package.token,
      flexformId:req.body.package.flexformId,
      description:req.body.description,
    });
    topUp.save((err,topUpDocs)=>{
      if(err)
      {
        console.log(err);
        return ReponseHelper.response(res, 422, HashDataHelper.makeError(err.message));
      }
      return ReponseHelper.response(res, 200, HashDataHelper.make(topUpDocs));
    })
  }
}


function writeLogPayment(req,res,callback){
    var mask = '0777';
    var fileName = (new Date().getTime()) + '-ccbill-log.txt';
    mkdirp(config.ccbillLogPath+req.body['X-user_id'],mask).then(made => {
    
    var newpath = config.ccbillLogPath+req.body['X-user_id']+'/' + fileName;
      var file = new File({
        type: 'ccbill log',
        userId: req.body['X-user_id'],
        fileName: fileName,
        path: newpath,
        mimeType: 'txt',
        date:(new Date().getTime()),        
      });
      file.save((err,file)=>{
        FileHelper.ensureDirectoryExistence(newpath);
        fs.writeFile(newpath,'Body request'+JSON.stringify(req.body)+'\n Query String' + JSON.stringify(req.query), (err)=> {
          if (err) {
            return  callback(null,req,res);
          }
          
          return callback(file,req,res);
          });
    })

    });
}


exports.deletePackage=(req,res)=>{
  TopUp.deleteOne({_id:req.params.id},(err,result)=>{
    if(err){
        console.log('err delete top up');
        console.log(err);
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
      }
      return ReponseHelper.response(res, 200, HashDataHelper.make(result));
});
}

function createTwilioPhone(){
  const accountSid = 'AC2d9082f07ccead85c92dfb9aa7c47131';
  const authToken = '9d18d7854a3a9ebcf83ee835178fda1d';
  const client = require('twilio')(accountSid, authToken);

client.incomingPhoneNumbers
      .create({phoneNumber: '+12568407674',smsUrl:'https://xtalk.hoanvusolutions.com.vn/sms',voiceUrl:'https://xtalk.hoanvusolutions.com.vn/voice',})
      .then((incoming_phone_number) =>{var phone_number=incoming_phone_number.phone_number;
      console.log(incoming_phone_number.phone_number);
      return phone_number;
      }).catch(err=>console.log('loi'+err));

}
