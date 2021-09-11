var _ = require('lodash');
var mongoose=require('mongoose');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var UserModel = require('../../../models/user.model');
var OrderHistory = require('../../../models/orderhistory.model');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');
const { result } = require('lodash');
const { authenticate } = require('passport');
var auth = require('../../auth.service');
var nodemailer=require('nodemailer');
var async=require("async");
var crypto=require('crypto');

exports.getReports=(req,res)=>{
    var total=OrderHistory.totalInMonth(8);
    var totalInYear=OrderHistory.getTokenInYear();
    return res.send([total]);
}

exports.getInfo=(req,res)=>{
  var page = req.query.page ? req.query.page : 1;
  var limit = (req.query.limit) ?parseInt(req.query.limit) : 30;
  var skip = (parseInt(page) - 1) * parseInt(limit);
  var sort ;
  var isPopulate=false;
  if (req.query.sort && req.query.order) 
  {
    switch (req.query.sort)
    {
      case 'name':
        isPopulate=true;
        var temp = { firstName :req.query.order ,lastName:req.query.order?req.query.order:'asc'};
        break;
      case 'date':
        isPopulate=false;
        var temp = { createdAt :req.query.order ,updatedAt:req.query.order?req.query.order:'asc'};
        break;
      case 'email':
          isPopulate=true;
          var temp = { email :req.query.order?req.query.order:'asc' };
          break;
      default:
        isPopulate=false;
        var temp = { _id:1};
        break;
    }
    
    sort = temp;
  }
  else
  {
    sort={_id: 1};
  }
  var filter = {content:{$ne:null}};
  var condition = {};
  var match =  {
      $match: condition
  }
  var userId = null;
  if(req.user){
      userId = req.user._id;  
  }
  var total={'_id' :null, 'total' :{ '$sum': 1 }};
  var pipe =[match];
  pipe.push({"$group":total});    
  
  OrderHistory.aggregate(pipe).then((totalDocs)=>{
    if(!isPopulate)
        {
          OrderHistory.find(condition).sort(sort).skip(skip).limit(limit).populate('userId','email firstName lastName avatar token').then((userDocs)=>{
            delete result.access_token;
            return ReponseHelper.response(res, 200, {data:userDocs,total_count:totalDocs[0].total});
      }).catch((errors)=>{
          console.log(errors);
          return ReponseHelper.response(res, 422,  HashDataHelper.makeError({status: 'valid', error: err,msg:errors.message}));
      })
    }
    else
    {
      
      OrderHistory.find(condition).skip(skip).limit(limit).populate({path:'userId',select:'email firstName lastName avatar token',math:{isDeleted:false},options:{ sort: sort}}).exec((err,userDocs)=>{
        return ReponseHelper.response(res, 200, {data:userDocs,total_count:totalDocs[0].total});
          }).catch((errors)=>{
              console.log(errors);
              return ReponseHelper.response(res, 422,  HashDataHelper.makeError({status: 'valid', error: err,msg:errors.message}));
          })
    }

  }).catch((err)=>{
    return ReponseHelper.response(res, 422,  HashDataHelper.makeError({status: 'valid', error: err,msg:err.message}));
  });
}