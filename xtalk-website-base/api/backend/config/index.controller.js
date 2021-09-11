'use strict'
var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var Ads = require('../../../models/file.model');
var StaticPage = require('../../../models/staticpage.model');
var SeoConfig = require('../../../models/seoconfig.model');
const { result } = require('lodash');
var authService = require('../../auth.service');
var ReponseHelper=require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');
const PageConfig=require('../../../models/pageconfig.model');
var File=require('../../../models/file.model');
exports.getConfig=(req,res)=>{
    PageConfig.findOne({},'currency fb footer gg logo price twitter faviconLink googleCode',(err,pageConfigDocs)=>{
        if(err){
            console.log(err);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        }
        if(!req.user || req.user.role != 'admin')
        {
          delete pageConfigDocs._id;
        }
        console.log('log pageconfg ');
        console.log(pageConfigDocs);
        return ReponseHelper.response(res, 200, HashDataHelper.make(pageConfigDocs));
    });
}

exports.putConfig=(req,res)=>{
    req.body.pageconfig=JSON.parse(req.body.pageconfig);
    req.body.pageconfig.price=parseInt(req.body.pageconfig.price);
    PageConfig.findOne({},(err,pageConfigDocs)=>{
        if(err){
            console.log(err);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        }
        if(req.files && req.files.logo ){
            uploadlogo(req,res,(err,file)=>{
                if(err){
                    // return errr

                }
                else{
                    if(pageConfigDocs){ 
                        var newvalues = { $set: {
                          logo:{
                            data:file.fileUrlBase,
                          },
                          footer:req.body.pageconfig.footer,
                          fb:req.body.pageconfig.fb,
                          gg:req.body.pageconfig.gg,
                          price:req.body.pageconfig.price,
                          twitter:req.body.pageconfig.twitter,
                          faviconLink:req.body.pageconfig.faviconLink,
                          googleCode:req.body.pageconfig.googleCode,
                          currency:req.body.pageconfig.currency,
                        } };  

                        PageConfig.update({}, newvalues, function(err, data) {  
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
                    else{
                        var newPageConfig=new PageConfig(req.body.pageconfig);
                        console.log(newPageConfig);
                        newPageConfig.save((errSave,docs)=>{
                            if(errSave){
                                console.log(errSave);
                                return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                            }
                            return ReponseHelper.response(res, 200, HashDataHelper.make(docs));;
                        })
                    }
                }
            })
        }
        else{
            var newvalues = { $set: {
                footer:req.body.pageconfig.footer,
                price:req.body.pageconfig.price,
                fb:req.body.pageconfig.fb,
                gg:req.body.pageconfig.gg,
                twitter:req.body.pageconfig.twitter,
                googleCode:req.body.pageconfig.googleCode,
                faviconLink:req.body.pageconfig.faviconLink,
                currency:req.body.pageconfig.currency,
              } 
            };  
              PageConfig.update({}, newvalues, function(err, data) {  
                  if (err){
                    console.log(err);
                    var errMsg={
                      message:"Error when update commission",
                      type:'error'
                    }
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                  }  
                  return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                  
              });  
        }
    });
}

exports.getSeoConfig=(req,res)=>{
     SeoConfig.findOne({},'title description keyword',(err,seoConfigDocs)=>{
        if(err){
            console.log(err);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(seoConfigDocs));
    });
}

exports.putSeoConfig=(req,res)=>{
    //req.body.seoConfig=JSON.parse(req.body);
  
      let newvalues={$set:{
      title:req.body.title,
      description:req.body.description,
      keyword:req.body.keyword
      }
      };
      SeoConfig.findOne({},(err,data)=>{
        if(err)
        {
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: err.message}));
        }
        if(!data)
        {
          var newConfig= new SeoConfig({
            title:req.body.title,
            description:req.body.description,
            keyword:req.body.keyword
            });
            newConfig.save((err,seoConfigDocs)=>{
            if(err){
                console.log(err);
                return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: err.message}));
            }
            return ReponseHelper.response(res, 200, HashDataHelper.make(seoConfigDocs));
        });
        }
        else{
          SeoConfig.update({_id:data._id},newvalues,(err,seoConfigDocs)=>{
            if(err){
                console.log(err);
                return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
            }
            return ReponseHelper.response(res, 200, HashDataHelper.make(seoConfigDocs));
        });
        }
      })
 }
    

function uploadlogo(req,res,callback) {
	console.log('call here');
  var mask = '0777';
  var fileName = FileHelper.convertFileName(req.files.logo.originalFilename);

  var image  = req.files.logo;
  console.log('new file name :' + fileName);
   mkdirp(config.logoPath, mask).then(made => {
    
    var newpath = config.logoPath+ req.user._id+'/'+fileName;
    console.log('new path :'+ newpath);
    fs.readFile(req.files.logo.path,  (err, data) => {
				File.findOne({userId: req.user._id, type: 'logo'}, function (err, file) {
					if (err) {
						console.log('updated logo Error', err);
						return callback();
					}
					let oldpath = null;

					if (!file) {
						file = new File({
							type: 'logo',
							userId: req.user._id,
							fileName: fileName,
							path: newpath,
							mimeType: image.mimetype,
							size: image.size
						});
					}else{
						oldpath = file.path;
						file.path = newpath;
						file.fileName = fileName;
						file.mimeType= image.mimetype;
                        file.size =  image.size;
					}
					file.save((err,file)=>{
                    FileHelper.ensureDirectoryExistence(newpath);
						fs.writeFile(newpath, data, (err)=> {
							if (err) {
							  return  callback(err, null);
							}
							if(oldpath){
								FileHelper.removeFile(oldpath)
							}
							return callback(null,file);
						  });
					})
					
				});
    });

  });
}