var _ = require('lodash');
var mongoose=require('mongoose');
var UserValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var UserModel = require('../../../models/user.model');
var Review  = require('../../../models/review.model');
var Withdraw = require('../../../models/withdraw.model');
var UserSubscribeModel = require('../../../models/userSubscribe.model');
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

exports.getReports =(req,res)=>{
    async.waterfall([
        (done)=>{
            var reports={
                totalUsers:0,
                newUsers:0,
                totalModel:0,
                todayOrders:0,
                totalRevenue:0,
                withdraw:{},
            }
            var condition={role:'member',isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :null,
             'newUser':{$sum: {$cond: [{$eq:["$isActive", false]}, 1, 0]}},
             'total' :{ '$sum': 1 }};
            //var newUsers={'_id':null,'rating':'total' :{ '$sum': 1 }};
            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            UserModel.aggregate(pipe).then((totalDocs)=>{
                reports.totalUsers=totalDocs.length?totalDocs[0].total:0;
                reports.newUsers=totalDocs.length?totalDocs[0].newUser:0;
                done(null,reports);
            }).catch((errors)=>
            {
            	console.log('errr in get total users');
                console.log(errors);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
            
        },
        (reports,done)=>{
            var condition={role:'model',isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :null,
             'newModel':{$sum: {$cond: [{$eq:["$isActive", false]}, 1, 0]}},
             'total' :{ '$sum': 1 }};
            //var newUsers={'_id':null,'rating':'total' :{ '$sum': 1 }};
            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            UserModel.aggregate(pipe).then((totalDocs)=>{
                reports.totalModel=totalDocs.length?totalDocs[0].total:0;
                reports.newModel=totalDocs.length?totalDocs[0].newModel:0;
                done(null,reports);
            }).catch((errors)=>
            {
            	console.log('errr in get total model');
                console.log(errors);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        },
        (reports,done)=>
        {
            var condition={isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :null,
            // 'reviewInDay':{$sum: {$cond: [{$eq:["$isActive", {$}]}, 1, 0]}},
             'total' :{ '$sum': 1 }};
            //var newUsers={'_id':null,'rating':'total' :{ '$sum': 1 }};
            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            Review.aggregate(pipe).then((totalDocs)=>{
                reports.totalReview=totalDocs.length?totalDocs[0].total:0;
                done(null,reports);
            }).catch((errors)=>
            {
            	console.log('errr in get total review');
                console.log(errors);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        },
        (reports,done)=>
        {
            var condition={isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :null,
             'pending':{$sum: {$cond: [{$eq:["$status",'pending']},1, 0]}},
             'reject':{$sum: {$cond: [{$eq:["$status",'reject']},1, 0]}},
             'approved':{$sum: {$cond: [{$eq:["$status",'approved']},1, 0]}},
             'total' :{ '$sum': 1 }};
            var pipe =[match];
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            Withdraw.aggregate(pipe).then((totalDocs)=>{
                reports.withdraw.pending=totalDocs.length?totalDocs[0].total:0;
                reports.withdraw.reject=totalDocs.length?totalDocs[0].reject:0;
                reports.withdraw.total=totalDocs.length?totalDocs[0].total:0;
                reports.withdraw.approved=totalDocs.length?totalDocs[0].approved:0;
                return ReponseHelper.response(res, 200, HashDataHelper.make(reports));
            }).catch((errors)=>
            {
            	console.log('errr in get total withdraw');
                console.log(errors);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        }
    ])
}

exports.getReportsCharts =(req,res)=>{
    async.waterfall([
        (done)=>{
            var reports={
                user:[],
                model:[],
                review:[],
                withdraw:[],
            }
            var condition={role:'member',isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :{"$month":"$createdAt"},
             'newUser':{$sum: {$cond: [{$eq:["$isActive", false]}, 1, 0]}},
             'total' :{ '$sum': 1 }};

            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
           // pipe.push({"$group":newUsers});    
            UserModel.aggregate(pipe).then((totalDocs)=>{
                
                reports.totalUsers=totalDocs[0].total;
                reports.user=totalDocs;
                done(null,reports);
            }).catch((errors)=>
            {
                console.log(errors.message);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
            
        },
        (reports,done)=>{
            var condition={role:'model',isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :{"$month":"$createdAt"},
             'newUser':{$sum: {$cond: [{$eq:["$isActive", false]}, 1, 0]}},
             'total' :{ '$sum': 1 }};
            //var newUsers={'_id':null,'rating':'total' :{ '$sum': 1 }};
            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            UserModel.aggregate(pipe).then((totalDocs)=>{
                reports.model=totalDocs;
                done(null,reports);
            }).catch((errors)=>
            {
                console.log(errors.message);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        },
        (reports,done)=>
        {
            var condition={isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :{"$month":"$createdAt"},
            // 'newUser':{$sum: {$cond: [{$eq:["$isActive", false]}, 1, 0]}},
             'total' :{ '$sum': 1 }};
            //var newUsers={'_id':null,'rating':'total' :{ '$sum': 1 }};
            var pipe =[match];
            // pipe.push({"$limit": parseInt(limit)});
            // pipe.push({$skip: skip});
            // pipe.push({"$sort": sort});
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            Review.aggregate(pipe).then((totalDocs)=>{
                console.log(totalDocs);
                reports.review=totalDocs;
                done(null,reports);
            }).catch((errors)=>
            {
                console.log(errors.message);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        },
        (reports,done)=>
        {
            var condition={isDeleted:false};
            var match =  {
                $match: condition
            }
            var userId = null;
            if(req.user){
                userId = req.user._id;
                
            }
            var total={'_id' :{"$month":"$createdAt"},
             'pending':{$sum: {$cond: [{$eq:["$status",'pending']},1, 0]}},
             'reject':{$sum: {$cond: [{$eq:["$status",'reject']},1, 0]}},
             'approved':{$sum: {$cond: [{$eq:["$status",'approved']},1, 0]}},
             'total' :{ '$sum': 1 }};
            var pipe =[match];
            pipe.push({"$group":total});
            //pipe.push({"$group":newUsers});    
            Withdraw.aggregate(pipe).then((totalDocs)=>{
                reports.withdraw=totalDocs[0];
                return ReponseHelper.response(res, 200, HashDataHelper.make(reports));
            }).catch((errors)=>
            {
                console.log(errors.message);
                return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',errors.message,[],'FAILED_GET_DATA'));
            }
            );
        }
    ])
}
 
