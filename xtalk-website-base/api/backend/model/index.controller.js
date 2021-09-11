var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var UserModel = require('../../../models/user.model');
var FileHelper = require('../../../helpers/FileHelper');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');
const { result } = require('lodash');
const { authenticate } = require('passport');
var auth = require('../../auth.service');

exports.getAllModels = function (req, res) {
  var page = req.query.page ? req.query.page : 1;
  var limit = (req.query.limit) ?  req.query.limit : 20;
  var skip = (page - 1) * limit;
  var sort =  {status: -1,_id:1};
	if (req.query.sort) {
		var dataSort = req.query.sort.split(',');
		var temp = '{"' + dataSort[0] + '":' + dataSort[1] + ' }';
		 sort = JSON.parse(temp);
	
	}
  var condition = {role:'clairvoyant',isActive:true};
  if(req.query.category){
	  condition['category'] = req.query.category;
  }
  var userId = null;
  if(req.user){
	  userId = req.user._id;
	  
  }
  var query = UserModel.find(condition).sort(sort).limit(parseInt(limit)).skip(skip);
  
  query.exec(function (err,result) {
    if(err)
    {
      console.log(err);
      return ReponseHelper.response(res, 500, HashDataHelper.makeError({error: err, 'msg': 'Server Error'}));
    }
    return ReponseHelper.response(res, 200, HashDataHelper.make(result));
  });
}

exports.allModel = (req, res) => {
  var page = req.query.page ? req.query.page : 1;
  var limit = (req.query.limit) ? parseInt(req.query.limit) : 20;
  var skip = (parseInt(page) - 1) * parseInt(limit);
  var sort = {
      "_id": 1
  };
  if (req.query.sort && req.query.order) {
      var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
      sort = JSON.parse(temp);
  }
  var filter = {
      content: {
          $ne: null
      }
  };
  var condition = {
      role: "clairvoyant",
      isDeleted: false,
  };
  var match = {
      $match: condition
  }
  var userId = null;
  if (req.user) {
      userId = req.user._id;

  }
  var total = {
      '_id': null,
      'total': {
          '$sum': 1
      }
  };
  var pipe = [match];
  pipe.push({
      "$group": total
  });
  sort.firstName=1;
  UserModel.aggregate(pipe).then((totalDocs) => {
      UserModel.find({
          isDeleted: false,
          role: 'clairvoyant',
      }).sort(sort).limit(limit+skip).then((userDocs) => {
          delete result.access_token;
          return ReponseHelper.response(res, 200, {
              data: userDocs,
              total_count: totalDocs[0].total
          });
      }).catch((errors) => {
          console.log(errors);
      })

  }).catch((err) => {
      console.log(err);
  })
}
exports.getModelInfo= (req,res)=>{
  UserModel.findById(req.params.id,(err,result)=>{
    return ReponseHelper.response(res, 200, HashDataHelper.make(result)); 
  })
}

exports.putAudio =(req,res)=>{
  UserModel.findById(req.user._id,(errUser,userDocs)=>{
    if(errUser) {
      console.log(err);
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
     uploadAudio(req,res,(err,file)=>{
       if(err || file === null){
         return 
       }
       userDocs.audio=file;
       userDocs.save((err,document)=>{
            var data = document.toObject();
            let token=auth.signToken(userDocs._id);
              if(token){
                data.access_token=token;
              }
            return ReponseHelper.response(res, 200, HashDataHelper.make(data));
          })
     })
  })
}

exports.putAudiobyAdmin=(req,res)=>{
  UserModel.findById(req.body.userId,(errUser,userDocs)=>{
    if(errUser) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    uploadAudiobyAdmin(req,res,(err,file)=>{
       if(err || file === null){
         console.log(err);
         return 
       }
       userDocs.audio=file;
       userDocs.save((err,document)=>{
            var data = document.toObject();
            let token=auth.signToken(userDocs._id);
              if(token){
                data.access_token=token;
              }
            return ReponseHelper.response(res, 200, HashDataHelper.make(data));
          })
     })
  })
}


function uploadAudio(req,res,callback) {
  var mask = '0777';
  var fileName = (new Date().getTime()) + path.extname(req.files.audio.originalFilename);
  var audio  = req.files.audio;
  mkdirp(config.audioPath+req.user._id, mask).then(made => {
    
    var newpath = config.audioPath+req.user._id+'/' + fileName;
    fs.readFile(req.files.audio.path,  (err, data) => {
				File.findOne({userId: req.user._id, type: 'audio'}, function (err, file) {
					if (err) {
						console.log('updatedAvatar Error', err);
						return callback();
					}
					let oldpath = null;

					if (!file) {
						file = new File({
							type: 'audio',
							userId: req.user._id,
							fileName: fileName,
							path: newpath,
							mimeType: audio.mimetype,
							size: audio.size
						});
					}else{
						oldpath = file.path;
						file.path = newpath;
						file.fileName = fileName;
						file.mimeType= audio.mimetype;
						file.size =  audio.size;
					}
					file.save((err,file)=>{
            FileHelper.ensureDirectoryExistence(newpath);
						fs.writeFile(newpath, data, (err)=> {
							if (err) {
                console.log(err);
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

function uploadAudiobyAdmin(req,res,callback) {
  var mask = '0777';
  var fileName = (new Date().getTime()) + path.extname(req.files.audio.originalFilename);
  var audio  = req.files.audio;
  mkdirp(config.audioPath+req.body.userId, mask).then(made => {
    
    var newpath = config.audioPath+req.body.userId+'/' + fileName;
    fs.readFile(req.files.audio.path,  (err, data) => {
				File.findOne({userId: req.body.userId, type: 'audio'}, function (err, file) {
					if (err) {
						console.log('updatedAvatar Error', err);
						return callback();
					}
					let oldpath = null;

          if (!file) 
          {
						file = new File({
							type: 'audio',
							userId: req.body.userId,
							fileName: fileName,
							path: newpath,
							mimeType: audio.mimetype,
							size: audio.size
						});
          }
          else
          {
						oldpath = file.path;
						file.path = newpath;
						file.fileName = fileName;
						file.mimeType= audio.mimetype;
						file.size =  audio.size;
          }
          try
          {
            file.save((err,file)=>{
              if(err)
              {
                console.log(err);
              }
              FileHelper.ensureDirectoryExistence(newpath);
              fs.writeFile(newpath, data, (err)=> {
                if (err) {
                  console.log(err);
                  return  callback(err, null);
                }
                if(oldpath){
                  FileHelper.removeFile(oldpath)
                }
                return callback(null,file);
                });
            })

          }
          catch(e){
              console.log(e.message);
          }
				
					
				});
    });

  });
}

exports.getSearch = (req,res)=>{
  const searchString=req.query.search;
  // UserModel.find({"$or":[{
  //     firstName:regexName(searchString),
  //     },
  //     {
  //       lastName:regexName(searchString),
  //     }
  // ]}).exec((err, docs) =>{ 
  //           if(err){
  //             console.log(err);
  //           }
  //           return ReponseHelper.response(res, 200, HashDataHelper.make(docs)); 
  //           });
  UserModel.find({"$text":{"$search":"/"+searchString+"/"},isActive:true,role:'clairvoyant'}).limit(5).exec((err, docs) =>{ 
          if(err){
            console.log(err);
          }
          return ReponseHelper.response(res, 200, HashDataHelper.make(docs)); 
          });
  
}

function regexName(name) {
	return {$regex: new RegExp([escapeRegExp(name).replace(/\s+/g, ' ').trim()].join(""), 'i')};
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

exports.deleteModel=function(req,res){
    var query=UserModel.update({_id:req.params.id,role:'clairvoyant'},{$set:{isActive:false,isDeleted:true}});
    query.exec((err,userDoc)=>{
      if (err) {
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: {type:'errors',message:"Can't not remove user"}}));
      }
      return ReponseHelper.response(res, 200, HashDataHelper.make(userDoc));

    });
}

