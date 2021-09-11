var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var FileHelper = require('../../../helpers/FileHelper');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');
var ImageHelper = require('../../../helpers/ImageHelper');
exports.uploadFile = function (req, res) {
	if (req.files && req.files.file) {
		uploadFile(req, res, (err, file) => {
			if (err) {
				return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 422, msg: 'Failed upload file' }));
			}
			return ReponseHelper.response(res, 200, HashDataHelper.make({ url: config.backendUrl + '/' + file.fileUrlBase }));
		});
	}
	else {
		return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 422, msg: 'File is empty' }));
	}
}

exports.getImage = (req,res)=>{
	const widthStr = req.query.width
	const heightStr = req.query.height
	let path = req.query.path
	const format =req.query.format
	let width, height
	if (widthStr) {
		width = parseInt(widthStr)
	}
	if (heightStr) {
		height = parseInt(heightStr)
	}
	res.type(`image/${ format || 'png' }`);
	try {
		path='public/'+path;
		if (fs.existsSync(path)) {
			ImageHelper.resizeStream(path, format, width, height,{withoutEnlargement: false, fit:'cover'}).pipe(res);
		}
		else
		{
			return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 'failed', msg: 'File not found' }));
		}
	  } 
	  catch(err) {
		console.log(err);
		return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 'failed', msg: 'File not found' }));
	  }
	
	//resize(path, format, width, height).pipe(res)
}

exports.getImageBanner=(req,res)=>{
	const widthStr = req.query.width
	const heightStr = req.query.height
	let path = req.query.path
	const format =req.query.format
	let width, height
	if (widthStr) {
		width = parseInt(widthStr)
	}
	if (heightStr) {
		height = parseInt(heightStr)
	}
	res.type(`image/${ format || 'png' }`);
	try {
		path='public/'+path;
		fs.exists(path,function(exists){
			if (exists) {
				return ImageHelper.resizeStream(path, format, width, height,{withoutEnlargement: false, fit:'fill'}).pipe(res);
			}
			else
			{
				return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 'failed', msg: 'File not found' }));
			}
		})
	  } 
	  catch(err) {
		console.log(err);
		return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 'failed', msg: 'File not found' }));
	  }
}

function uploadFile(req, res, callback) {
	var mask = '0777';
	var fileName = (new Date().getTime()) + path.extname(req.files.file.originalFilename);
	var fileUpload = req.files.file;
	var dirPath = config.uploadPath + req.user._id + '/common/chat/images';
	mkdirp(dirPath, mask).then(made => {
		var newpath = dirPath + req.user._id + '/' + fileName;
		fs.readFile(req.files.file.path, (err, data) => {
			file = new File({
				type: 'images-chat',
				userId: req.user._id,
				fileName: fileName,
				path: newpath,
				mimeType: fileUpload.mimetype,
				size: fileUpload.size
			});
			file.save((err, file) => {
				FileHelper.ensureDirectoryExistence(newpath);
				fs.writeFile(newpath, data, (err) => {

					if (err) {
						return callback(err, null);
					}
					
					return callback(null, file);
				});
			})

		});
	});

};
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