var _ = require("lodash");
var mongoose = require("mongoose");
//var UserValidator = require('./validators.js');
var HashDataHelper = require("../../../helpers/HashDataHelper");
var ReponseHelper = require("../../../helpers/ReponseHelper");
var FileHelper = require("../../../helpers/FileHelper");
var StaticPage = require("../../../models/staticpage.model");

exports.updatedStatic=(req,res)=>
{
    var newValue={
        $set:{
            content:req.body.content,
            title:req.body.title,
        }
    }
   if(req.body._id)
    {
         StaticPage.update({_id:req.body._id},newValue).then((data)=>{
            ReponseHelper.response(res,200,HashDataHelper.make(data));
         }).catch((error)=>{
        ReponseHelper.response(res,422,HashDataHelper.makeError(error.message));
        })
    }
    else
     {
         const newStaticPage=new StaticPage({
            content:req.body.content,
            title:req.body.title,
            slug:req.body.slug,
         });
         newStaticPage.save((err,data)=>{
            if(err)
               {
                   ReponseHelper.response(res,422,HashDataHelper.makeError({status:'failed',msg:err.message}));
               }
            else
            {
                ReponseHelper.response(res,200,HashDataHelper.make(data));
            }

         })
     }
}

exports.deleteSaticPage=(req,res)=>{
    // set delete flag 
    var value={
        isDeleted:true
    }
    StaticPage.update({_id:req.params.id},value).then((data)=>{
        return ReponseHelper.response(res,200,HashDataHelper.make(data));
    }).catch(err=>{
        console.log(err);
        return ReponseHelper.response(res,422,HashDataHelper.makeError(err.message));
    })
}

exports.getAllPage=(req,res)=>{
    var condition={
        isDeleted:false
    }
    StaticPage.find(condition).then((data)=>{ return ReponseHelper.response(res,200,HashDataHelper.make(data));
    }).catch(err=>{
        console.log(err);
        return ReponseHelper.response(res,422,HashDataHelper.makeError(err.message));
    });
}