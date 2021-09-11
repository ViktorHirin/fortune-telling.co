'use strict'
var _ = require('lodash');
// var ReviewValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var Ads = require('../../../models/ads.model');

exports.getAds=(req,res)=>
{
    var pipe=[];
    var math= {
        $match: {
            isActived: true,
            isDeleted: false,
            
        }
    };
    var group=
      {
        $group: {
            _id: "$postion",
            files: {
                $push: "$file"
            },
            title: {
                $push: "$title"
            },
            description: {
                $push: "$description"
            },
            type: {
                $push: "$type"
            }
        },
        
    };
    var lookup= {
        $lookup: {
            from: 'files',
            localField: 'files',
            foreignField: '_id',
            as: 'file_doc'
        }
    };
    var project={
        $project: {
            postion: "$_id",
            type: 1,
            description: 1,
            _id: 0,
            title:"$title",
            file_doc:"$file_doc.fileUrlBase"
            //file_doc._id: 1
        }
    }
    //var queryAds=Ads.find().or([{postion:'top',isActived:true,isDeleted:false},{postion:'footer',isActived:true,isDeleted:false}]).populate('file','fileUrlBase');
    pipe=[math,group,lookup,project];
    var queryAds=Ads.aggregate(pipe);
    queryAds.exec((err,data)=>{
      if(err || data == null)
      {
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
      }
      console.log('data result');
      console.log(data);
      var result={};
      result.headerUrl=data[0]?data[0].file_doc:null;
      result.footerUrl=data[1]?data[1].file_doc:null;
      return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    })
    
}

