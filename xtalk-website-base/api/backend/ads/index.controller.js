var _ = require('lodash');
var mongoose=require('mongoose');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var ImageHelper = require('../../../helpers/ImageHelper');
var UserModel = require('../../../models/user.model');
var Ads = require('../../../models/ads.model');
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

exports.postAds=(req,res)=>{
    req.body.data=JSON.parse(req.body.data);
    if(req.body.data._id)
    {
        Ads.findOne({_id:req.body.data._id},(err,adsDocs)=>{
            if(err){
                return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422, error: err}));
            }
            if(req.files && req.files.ads){
                uploadAds(req,res,(err,file)=>{
                    if(err)
                    {
                        // return errr
                        console.log(err);
                    }
                    else
                    {
                        if(adsDocs)
                        { 
                            var newvalues = { $set: {
                              file:file._id,
                              type:'image',
                              description:req.body.data.description,
                              tittle:req.body.data.title,
                              postion:req.body.postion,
                            } };  
    
                            Ads.findByIdAndUpdate(adsDocs._id , newvalues, function(err, data) {  
                                if (err)
                                {
                                  var errMsg={
                                    message:"Error when update ads",
                                    type:'error'
                                  }
                                  console.log(err); 
                                  return ReponseHelper.response(res, 421, HashDataHelper.makeError(errMsg));
                                }  
                                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                                
                            });  
                        }
                        else{
                            var newads=new Ads(req.body.data);
                            newads.file=file;
                            newads.save((errSave,docs)=>{
                                if(errSave){
                                    console.log('err save '+errSave.message);
                                    return ReponseHelper.response(res, 423, HashDataHelper.makeError({status: 422, error: err}));
                                }
                                return ReponseHelper.response(res, 200, HashDataHelper.make(docs));
                            })
                        }
                    }
                })
            }
            else
            {
                var newvalues = { $set: {
                    title:req.body.data.title,
                    type:req.body.data.type,
                    description:req.body.data.description,
                    tittle:req.body.data.title,
                    postion:req.body.data.postion,
                  } 
                };  
               Ads.findByIdAndUpdate(req.body.data._id,newvalues,(errUpdate,dataUpdate)=>{
                   if(err)
                   {
                    return ReponseHelper.response(res, 421, HashDataHelper.makeError(errUpdate.message));        
                   }
                   return ReponseHelper.response(res, 200, HashDataHelper.make(dataUpdate));;
               })
            }
        });
    }
    else
    {
        if(req.files && req.files.ads){
            uploadAds(req,res,(err,file)=>{
                if(err)
                {
                    // return errr
                    console.log(err);
                }
                else
                {
                    var newvalues = {
                        file:file._id,
                        type:req.body.data.type,
                        description:req.body.data.description,
                        title:req.body.data.title,
                        postion:req.body.data.postion,
                      } ;  
                      console.log(newvalues);
                      var adsNew=new Ads(newvalues);
                      adsNew.save((err, data)=>{  
                          if (err)
                          {
                            var errMsg={
                              message:"Error when update ads",
                              type:'error'
                            }
                            console.log(err); 
                            return ReponseHelper.response(res, 421, HashDataHelper.makeError(errMsg));
                          }  
                          return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                          
                      });  
                }
            })
        }
        else
        {
            ReponseHelper.response(res,422,HashDataHelper.makeError('File is empty'));
        }
    }
  }

exports.getAds=(req,res)=>
{
     var query=Ads.find({isDeleted:false}).populate('file','_id path fileUrlBase');
     query.exec((err,data)=>{
        if(err)
        {
            console.log(err.message);
            return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',err.message,[],'FAILED_GET_DATA'));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    });
}

exports.putActive=(req,res)=>
{
        Ads.updateMany({type:req.body.ads.postion},{$set:{isActived:false}},(error,adsDocs)=>{
            if(error)
            {
                return ReponseHelper.response(res, 422, HashDataHelper.makeError('failed',error.message,[],'FAILED_DEACTIVE_ADS'));
            }
            Ads.findOneAndUpdate({_id:req.params.id},{$set:{isActived:true}},(err,data)=>
            {
                if(err || data==null)
                {
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError('failed',err.message,[],'FAILED_ACTIVE_ADS'));
                }
                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                
            })
        }  ); 
}

exports.putDeactive=(req,res)=>
{
    console.log(req.params.id);
    Ads.findOneAndUpdate({_id:req.params.id},{$set:{isActived:false}},(err,data)=>
    {
        if(err || data==null)
        {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError('failed',err.message,[],'FAILED_DEACTIVE_ADS'));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
        
    });
}

exports.deleteAds=(req,res)=>
{
    Ads.findOneAndUpdate({_id:req.params.id},{$set:{isDeleted:true}},(err,data)=>
    {
        if(err || data==null)
        {
            return ReponseHelper.response(res, 200, HashDataHelper.makeError('failed',err.message,[],'FAILED_DELETE_ADS'));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
        
    })
}


function uploadAds(req,res,callback) {
    var mask = '0777';
    var fileName = (new Date().getTime()) + path.extname(req.files.ads.originalFilename);
    var ads  = req.files.ads;
    console.log("ads file");
    console.log(req.body.data);
    mkdirp(config.adsPath+req.body.data.type, mask).then(made => {    
      var newpath = config.adsPath+req.user._id+'/' + fileName;
      const pathFile= config.adsPath+req.user._id+'/';
      fs.readFile(req.files.ads.path,  (err, data) => {

                  File.findOne({_id: req.body.data.file?req.body.data.file._id:null}, function (err, file) {
                      if (err) {
                          console.log('updatedAvatar Error', err);
                          return callback();
                      }
                      let oldpath = null;
                      console.log('log file');
                      console.log(file);
                      if (!file) {
                          file = new File({
                              type: 'ads',
                              userId: req.user._id,
                              fileName: fileName,
                              path: newpath,
                              mimeType: ads.mimetype,
                              size: ads.size
                          });
                      }
                      else
                      {
                          oldpath = file.path;
                          file.path = newpath;
                          file.fileName = fileName;
                          file.mimeType= ads.mimetype;
                          file.size =  ads.size;
                          file.type ="ads";
                      }
                      file.save((err,file)=>{
                            console.log("new path:+ " +newpath);
                            FileHelper.ensureDirectoryExistence(newpath);
                            fs.writeFile(newpath, data, (err)=> {
                                if (err) {
                                  console.log(err);
                                  return  callback(err, null);
                                }
                                if(oldpath){
                                    ImageHelper.removeOldAds(oldpath);
                                }
                                const imageSize = Object.values(config.adsSize);
                                imageSize.forEach(options => {
                                    ImageHelper.resizeImage(data, options).then(image => {
                                        fs.writeFileSync(pathFile + options.width + 'x' + options.height + '_' + fileName, image)
                                    })
                                })
                                return callback(null,file);
                              });
                         
                      })
                      
                  });
      });
  
    });
  }