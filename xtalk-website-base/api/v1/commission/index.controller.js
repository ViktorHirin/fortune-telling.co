'use strict'
var CommissionModel = require('../../../models/commission.model');
var OptionsModel = require('../../../models/options.model');
var ReponseHelper=require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');

exports.getCommission=(req,res)=>{
  OptionsModel.find({option_name:'commision'},{option_name:true,option_value:true,_id:false},(err,commissionDocs)=>{
        if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
          }
          return ReponseHelper.response(res, 200, HashDataHelper.make(commissionDocs));
    })
}

