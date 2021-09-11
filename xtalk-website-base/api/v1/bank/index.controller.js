'use strict'
var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var ReponseHelper=require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');
const Bank=require('../../../models/bank.model');

exports.getlistCountry=(req,res)=>{}

exports.getBank=(req,res)=>{

    Bank.findOne({userId:req.user._id},(err,bankDocs)=>{
        if(err){
            console.log(err);
            return ReponseHelper.response(res,422,HashDataHelper.makeError({status:'errors',err:'Failed update your bank account'}));
        }
        return  ReponseHelper.response(res,200,HashDataHelper.make(bankDocs));
});
}

exports.putBank=(req,res)=>{
    Bank.findOne({userId:req.user._id},(err,bankDocs)=>{
        if(err){
            return ReponseHelper.response(res,422,HashDataHelper.makeError({status:'errors',err:'Failed update your bank account'}));
        }
        var newValue=req.body.bankInfo;
        if(bankDocs && bankDocs._id)
        {
            Bank.findByIdAndUpdate(bankDocs._id,newValue,(err,resultUpdate)=>{
                if(err){
                    return ReponseHelper.response(res,422,HashDataHelper.makeError({status:'errors',err:'Failed update your bank account'}));
                }
                ReponseHelper.response(res,200,HashDataHelper.make({status:'success',msg:'Updated Successfully'}));
            })
        }
        else{
            var newBank=new Bank(req.body.bankInfo);
            newBank.save((errUpdate,resultUpdate)=>{
                if(errUpdate){
                    console.log(errUpdate);
                    return ReponseHelper.response(res,422,HashDataHelper.makeError({status:'errors',err:'Failed update your bank account'}));
                }
                ReponseHelper.response(res,200,HashDataHelper.make({status:'success',msg:'Updated successfully'}));
            });
        }
    })
}
