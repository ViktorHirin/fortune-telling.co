var _ = require('lodash');
//var UserValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('../../../config/config');
var File = require('../../../models/file.model');

exports.getGallery= (req,res)=>{
    var query=File.find({userId:req.params.id,type:'gallery'}).sort({createAt:1});
    query.exec((err,fileData)=>{
        if(err)
        {
            console.log(err);
            return ReponseHelper.response(res,200,HashDataHelper.makeError(422,err.message,[],"ERR_FIND"));
        }
        return ReponseHelper.response(res,200,HashDataHelper.make(fileData));
    })

}

exports.postGallery=(req,res)=>{
     console.log(req.files.image.path);  
   if(req.files && req.files.image)
   {
    uploadGallery(req,res,(err,file)=>{
        if(err || file == []){
          return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,err.msg,[],'FAILD_POST_GALLERY')); 
        }
        if(file === undefined)
        {
            return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,'upload limitation',file));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(file));
      })
   }
}

exports.deleteGallery=(req,res)=>{
    var query=File.findOneAndRemove({_id:req.params.id,type:'gallery',userId:req.user._id});
    query.exec((error,data)=>{
        if(error)
        {
            return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,err.msg,[],'FAILD_DELETE_GALLERY')); 
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
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

function uploadGallery(req,res,callback) {
	console.log('call here');
    var mask = '0777';
    var fileName = (new Date().getTime()) + path.extname(req.files.image.originalFilename);
    var image  = req.files.image;

  mkdirp(config.galleryPath+req.user._id, mask).then(made => {
    
    var newpath = config.galleryPath+req.user._id+'/' + fileName;
    fs.readFile(req.files.image.path,  (err, data) => {

    file = new File({
        type: 'gallery',
        userId: req.user._id,
        fileName: fileName,
        path: newpath,
        mimeType: image.mimetype,
        size: image.size
    });
    file.save((err,file)=>{
        fs.writeFile(newpath, data, (err)=> {
            if (err) {
                return  callback(err, null);
            }
           
            return callback(null,file);
            });
					})
					
				});
    });

  };