'use strict'
var CommissionModel = require('../../../models/commission.model');
var OptionsModel = require('../../../models/options.model');
var ReponseHelper=require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');

exports.setCommission=(req,res)=>{
    if(req.body.commission._id){
        CommissionModel.findById({_id:req.body.commission._id},(err,commissionDocs)=>{
          if(err){
            return ReponseHelper.response(res, 422, HashDataHelper.makeError(err));
          }
          else{
            if(commissionDocs){
             var myquery = { _id: commissionDocs._id };  
                 var newvalues = { $set: {
                   percent:req.body.commission.percent,
                   type:req.body.commission.type,
                 } };  
    
                 CommissionModel.findByIdAndUpdate(commissionDocs._id , newvalues, function(err, data) {  
                     if (err){
                       var errMsg={
                         message:"Error when update commission",
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
    else{
     var  newCommission=new CommissionModel();
      newCommission.percent=req.body.commission.percent,
      newCommission.type=req.body.commission.type,
      newCommission.save((err,commissionDocs)=>{
        if (err) {
          console.log(err);
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(commissionDocs));
      })
    }
}