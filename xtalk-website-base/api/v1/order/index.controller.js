'use strict'
var _ = require('lodash');
// var ReviewValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var OrderModel=require("../../../models/orderhistory.model");

exports.getiInfo=(req,res)=>
{
    var query=OrderModel.find({userId:req.user._id},{topUp:1,status:1,token:1,userId:1,createdAt:1,updatedAt:1})
    .populate('topUp','price token')
    .populate("userId",'firstName lastName email');
    query.exec((err,orderDocs)=>{
        if(err)
        {
            console.log(err.message);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError(false,err.message));
        }
        console.log(orderDocs);
        return ReponseHelper.response(res, 200, HashDataHelper.make(orderDocs));
    })

}
