var _ = require('lodash');
var mongoose=require('mongoose');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var UserModel = require('../../../models/user.model');
var UserSubscribeModel = require('../../../models/userSubscribe.model');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');
const { result } = require('lodash');
const { authenticate } = require('passport');
var auth = require('../../auth.service');
var async=require("async");
var crypto=require('crypto');

exports.uploadFile = function (req, res) {
  console.log(req.body)
  if(req.files && req.files.file)
  {
  	uploadFile(req,res,(err,file)=>{
  		if(err)
  		{
  			return  ReponseHelper.response(res, 422, HashDataHelper.makeError({status:422,msg:'Failed upload file'}));
  		}
  		console.log(file);
  		return ReponseHelper.response(res, 200, HashDataHelper.make({url:config.backendUrl + '/'+file.fileUrlBase}));
  	});
  }
  else
  {
  	return  ReponseHelper.response(res, 422, HashDataHelper.makeError({status:422,msg:'File is empty'}));
  }
}
function uploadFile(req,res,callback) {
	console.log('call here');
  var mask = '0777';
  var fileName = (new Date().getTime()) + path.extname(req.files.file.originalFilename);
  var fileUpload  = req.files.file;

  mkdirp(config.uploadPath+req.user._id, mask).then(made => {
    
    var newpath = config.faviconPath+req.user._id+'/'+fileName;
    fs.readFile(req.files.file.path,  (err, data) => {
				File.findOne({userId: req.user._id, type: 'favicon'}, function (err, file) {
					if (err) {
						console.log('updated file Error', err);
						return callback();
					}
					let oldpath = null;

					if (!file) {
						file = new File({
							type: 'favicon',
							userId: req.user._id,
							fileName: fileName,
							path: newpath,
							mimeType: fileUpload.mimetype,
							size: fileUpload.size
						});
					}else{
						oldpath = file.path;
						file.path = newpath;
						file.fileName = fileName;
						file.mimeType= fileUpload.mimetype;
						file.size =  fileUpload.size;
					}
					file.save((err,file)=>{
            FileHelper.ensureDirectoryExistence(newpath);
            			console.log('path:'+newpath);
            			console.log('data');
            			console.log(data);
						fs.writeFile(newpath, data, (err)=> {

							if (err) {
							  return  callback(err, null);
							}
							if(oldpath){
								removeFile(oldpath)
							}
							return callback(null,file);
						  });
					})
					
				});
    });

  });
}
var removeFile = function (paths) {
	fs.lstat(paths, function (err, stats) {
		if (err) {
			//console.log(err);
			return;
		}
		if (stats.isFile()) {
			console.log('Remove image ', paths);
			fs.unlinkSync(paths);
		}
	});
};