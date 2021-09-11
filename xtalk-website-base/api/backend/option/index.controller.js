'use strict'
var OptionsModel = require('../../../models/options.model');
var validator = require('./validators');
var ReponseHelper=require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');

exports.putOption=(req,res)=>{
  validator.validateUpdate(req,(err, data)=>{
    if(err)
    {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status:'failed',msg:err.message}));
    }
    if(data.name)
    {
       let set={
         option_name:data.name,
         option_value:data.value
       }
       OptionsModel.update({option_name:data.name},{$set:set}).then(optionDocs=>{
        return ReponseHelper.response(res, 200, HashDataHelper.make(optionDocs));
       }).catch(err=>{
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status:'failed',msg:err.message}));
       })
    }
  });
};

exports.getAll=(req,res)=>{
  OptionsModel.find({option_name:{$in:['commission' ,'rate_money']}},{option_name:true,option_value:true,_id:false},(err,commissionDocs)=>{
        if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
          }
          return ReponseHelper.response(res, 200, HashDataHelper.make(commissionDocs));
    })
}