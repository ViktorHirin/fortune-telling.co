var _ = require('lodash');
var config = require('../../../config/config');
var mongoose=require('mongoose');
var UserValidator = require('./validators.js');
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
var nodemailer=require('nodemailer');
var async=require("async");
var crypto=require('crypto');
const ImageHelper= require('../../../helpers/ImageHelper');
exports.register = function (req, res) {
  UserValidator.validateCreate(req, function (err, data) {
    if (err) {
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422, error: err,msg:err.message}));
    }
    var newUser = new UserModel(data);
    var now = new Date();
    newUser.emailVerifyExpired = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    newUser.role = 'member';
    newUser.save(function (err, user) {
      if (err) 
      {
         console.log(err.message);
         return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422, error: err,msg:err.message}));
      }
      //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
      var data = user.toObject();
      return ReponseHelper.response(res, 200, HashDataHelper.make(data,200));
    });
  });
}

exports.registerByAdmin = function (req, res) {
  console.log(req.body);
  UserValidator.validateCreate(req, function (err, data) {
    if (err) {
      console.log(err);
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    var newUser = new UserModel(data);
    var now = new Date();
    newUser.emailVerifyExpired = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    newUser.role = req.body.role;
    newUser.save(function (err, user) {
      if (err) 
      {
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: err.message }));
      }
      //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
      var data = user.toObject();
      return ReponseHelper.response(res, 200, HashDataHelper.make(data,200));
    });
  });
}

exports.registerModel = function (req, res) {
  
  UserValidator.validateCreateModel(req, function (err, data) {
    if (err) {
      console.log('log errr')
      console.log(err.message);
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422, error: err,msg:err[0].msg}));
    }
    
    if(req.files != null &&  req.files.audio != null)
    {
      createModelV2(data,req,res);
    }
    else
    {
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422,msg:'File empty'}));
    }
    
  });
}


exports.getInfoUser = function (req, res) {

  UserModel.findOne({_id: req.params.id,isDeleted:false,isActive:true}, '-hashedPassword', function (err, docs) {
    if (err) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    var data = docs.toObject();
	if(req.user){
		UserSubscribeModel.findOne({userId:req.user._id,subId:data._id,isDeleted:false,isActive:true},function(err,docs){

			if(docs){
				data.isFollowed = true;
			}else{
				data.isFollowed = false;
			}
			return ReponseHelper.response(res, 200, HashDataHelper.make(data));
		});
	}else{
		data.isFollowed = false;
		return ReponseHelper.response(res, 200, HashDataHelper.make(data));
	}

  })
}

exports.me = function (req, res) {
  UserModel.findOne({_id: req.user._id}, '-hashedPassword', function (err, docs) {
    if (err) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    var data = docs.toObject();
    let token=auth.signToken(docs._id);
    if(token){
      data.access_token=token;
    }
	return ReponseHelper.response(res, 200, HashDataHelper.make(data));

  })
}
function updateProfile(docs,data,res){
	  docs.gender = data.gender?data.gender:'male';
    docs.age = data.age;
    docs.category=data.category;
    docs.specialities=data.specialities;
    docs.interests=data.interests
		docs.location = data.location;
		docs.about = data.about;
		docs.orientation = data.orientation;
    if(docs.role == 'clairvoyant')
    {
      docs.phone = data.phone;
      console.log('type data phone');
      console.log(typeof data.phone);
    }
    docs.languages=data.languages;
    docs.service=data.service;
    docs.doNotDisturb=data.doNotDisturb;
    docs.email=data.email;
    docs.firstName=data.firstName;
    docs.lastName=data.lastName;
    
    if(data.avatar)
    {
      docs.avatar = data.avatar;
		}
		docs.save((err,result)=>{
      if(err)
      {
        let message=err.message;
        message=message.replace(/phone.e164Number:/g,'phone number:');
        console.log(message);

        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status:false,msg:message}));
      }
		return ReponseHelper.response(res, 200, HashDataHelper.make(result));
		})
		
}
exports.updateUser = function (req, res) {
  UserValidator.validateUpdate(req, function (err, data) {
    if (err) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
      UserModel.findOne({_id:req.user._id,isDeleted:false},function(err,docs){
        if(err)
        {
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
        }
        if (req.files !='null' && typeof req.files.avatar != 'undefined') 
        {
            return ImageHelper.uploadAvatar(req, res, function (error,reuslt) {
              if (error)
              {
                return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
              }
              data.avatar = reuslt.toObject();
              return updateProfile(docs,data, res);
            });
    
        } 
        else 
        {
          
          return updateProfile(docs,data, res);
        }
    
      })
    

  });
}



exports.subscribe = function (req, res) {
    var userId = req.params.id;
    UserModel.findOne({_id:userId},function(err,result){
      if(err){
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
      }
      if(!result){
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 404,'msg':'User not found', error: err}));
      }
      UserSubscribeModel.findOne({userId:req.user._id,subId:req.params.id},function(err,result){
        if(err){
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
        }
        if(!result){
          console.log('go here');
          result = new UserSubscribeModel({
          userId: req.user._id, subId: req.params.id
        });
        result.save(function (err, user) {
          if (err) {
            console.log('user',user);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
          }
          console.log(user);
          //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
     
          return ReponseHelper.response(res, 200, HashDataHelper.make({added:true}));
        });
      }else{
        result.remove(function(err,result){
          if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
          }
          //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
     
          return ReponseHelper.response(res, 200, HashDataHelper.make({added:false}));
        });
      }
    })
    });
}

exports.login= function (req,res){
  UserValidator.validateLogin(req, function (err, data) {
    if (err) {
      return ReponseHelper.response(res, 401, HashDataHelper.makeError({status: 422, error: err}));
    }
  UserModel.findOne({email:data.email,isDeleted:false},(err,result)=>{
    if(!result){
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 'invalid',msg:'Invalid email or Password', error: err}));
    }
    if(!result.isActive){
       if(result.role =="member")
        {
          return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 'invalid',msg:'Your account is not active.Please contact support', error: err}));
        }
        else
        {
          return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 'invalid',msg:'Waiting for Admin Approval', error: err}));
        }
    }
    if(result.authenticate(data.password)){
      let data=result.toObject();
      let token=auth.signToken(result._id);
      if(token){
        data.access_token=token;
      }
      return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    }
    else{
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 'invalid',msg:'Invalid email or Password'}));    }
  })
});
}

exports.allUsers = function (req,res){
 var page = req.query.page ? req.query.page : 1;
  var limit = (req.query.limit) ?parseInt(req.query.limit) : 20;
  var skip = (parseInt(page) - 1) * parseInt(limit);
  var sort;
      if (req.query.sort && req.query.order) 
      {
        if(req.query.sort == 'name')
        {
          sort={
            firstName:req.query.order || 'asc',
            lastName:req.query.order|| 'asc'
          }
        }
        else
        {
          var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
          sort = JSON.parse(temp);
        }
      }
  var filter = {content:{$ne:null}};
  var condition = {role:"member",isDeleted:false};
  var match =  {
      $match: condition
  }
  var userId = null;
  if(req.user){
      userId = req.user._id;
      
  }
  var total={'_id' :null, 'total' :{ '$sum': 1 }};
  var pipe =[match];
  // pipe.push({"$limit": parseInt(limit)});
  // pipe.push({$skip: skip});
  // pipe.push({"$sort": sort});
  pipe.push({"$group":total});    
  UserModel.aggregate(pipe).then((totalDocs)=>{
    console.log(sort);
    UserModel.find({isDeleted:false,role:'member'}).sort(sort).skip(skip).limit(limit).then((userDocs)=>{
           delete result.access_token;
           return ReponseHelper.response(res, 200, {data:userDocs,total_count:totalDocs[0]?totalDocs[0].total:0,status:'success'});
      }).catch((errors)=>{
          console.log(errors);
      })

  }).catch((err)=>{
      console.log(err);
  })
}

exports.allModels=(req,res)=>{
  var page = req.query.page ? req.query.page : 1;
  var limit = (req.query.limit) ?parseInt(req.query.limit) : 20;
  var skip = (parseInt(page) - 1) * parseInt(limit);
  var sort =  {"_id": 1};
      if (req.query.sort && req.query.order) {
      var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
      console.log(temp);
          sort = JSON.parse(temp);
      }
  var filter = {content:{$ne:null}};
  var condition = {role:"model",isDeleted:false};
  var match =  {
      $match: condition
  }
  var userId = null;
  if(req.user){
      userId = req.user._id;
      
  }
  var total={'_id' :null, 'total' :{ '$sum': 1 }};
  var pipe =[match];
  pipe.push({"$group":total});    
  UserModel.aggregate(pipe).then((totalDocs)=>{
    UserModel.find({isDeleted:false,role:'clairvoyant'}).sort(sort).skip(skip).limit(limit).then((userDocs)=>{
           delete result.access_token;
           return ReponseHelper.response(res, 200, {data:userDocs,total_count:totalDocs[0].total});
      }).catch((errors)=>{
          console.log(errors);
      })

  }).catch((err)=>{
      console.log(err);
  })
}

exports.changePasswordasAdmin=(req,res)=>{
  console.log('log boy change pass');
  console.log(req.body);
  UserModel.findOne({_id:req.body.user.id},function(err,userDocs){
    if(err || userDocs == null){
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    var newvalues = { $set: {
      hashedPassword: userDocs.encryptPassword(req.body.user.password),
    } };  
    UserModel.findByIdAndUpdate(userDocs.id,newvalues,(err,data)=>{
      if (err){
        var errMsg={
          message:"Error when update password",
          type:'error'
        }
        console.log(err); 
        return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
      }  
      return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    })

  })

}

exports.changePassword=(req,res)=>{
  if(req.body.user.id == req.user._id){
      UserModel.findOne({_id:req.user._id,isDeleted:false},function(err,userDocs){
        if(err){
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
        }
        var newvalues = { $set: {
          hashedPassword: userDocs.encryptPassword(req.body.user.password),
        } };
        if(userDocs.authenticate(req.body.user.oldPassword)){
          UserModel.findByIdAndUpdate(userDocs.id,newvalues,(err,data)=>{
            if (err){
              var errMsg={
                message:"Error when update password",
                type:'error'
              }
              console.log(err); 
              return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
            }  
            return ReponseHelper.response(res, 200, HashDataHelper.make(data));
          })
  
        }
        else{
          return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: {
            status:'failse',
            msg:'Old password not match'
          }}));
        }
     
      })
  }
  else{
    return res.send(403);
  }

}

exports.getDetail=(req,res)=>{
  UserModel.find({_id:req.params.id},{'firstName':1,'lastName':1,'role':1,'age':1,'avatar.fileUrlBase':1}).then((data)=>{
    return ReponseHelper.response(res,200,HashDataHelper.make(data));
  }).catch((err)=>{
    return ReponseHelper.response(res,200,HashDataHelper.makeError(422,err.message));
  })
}



function uploadAvatartoUser(req,res,callback) {
	console.log('call here');
  var mask = '0777';
  var fileName = (new Date().getTime()) + path.extname(req.files.avatar.originalFilename);
  var image  = req.files.avatar;

  mkdirp(config.avatarPath+req.body.user.id, mask).then(made => {
    req.body.user=JSON.parse(req.body.user);
    var newpath = config.avatarPath+req.body.user.id+'/' + fileName;
    fs.readFile(req.files.avatar.path,  (err, data) => {
				File.findOne({userId: req.body.user.id, type: 'avatar'}, function (err, file) {
					if (err) {
						console.log('updatedAvatar Error', err);
						return callback();
					}
					let oldpath = null;

					if (!file) {
						file = new File({
							type: 'avatar',
							userId: req.body.user.id,
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
					file.save((err,resFile)=>{
            FileHelper.ensureDirectoryExistence(newpath);
						fs.writeFile(newpath, data, (err)=> {
							if (err) {
                if(data == null){
                console.log('loi ghi file');
                }
                console.log(err);
							  return  callback(err, null);
							}
							if(oldpath){
								removeFile(oldpath)
              }
              console.log('new path');
              console.log(newpath);
							return callback(null,resFile);
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

function uploadAudio(req,res,callback) {
	console.log('call here');
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

function createModel(docs,file,res){
  var newUser = new UserModel(docs)
    // if (err) {
    //   return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    // }
    console.log('file');
    console.log(file);
    newUser.role='clairvoyant';
    //newUser.interests=docs.user.interests;
    newUser.specialities=docs.user.specialities;
   // newUser.audio=file;
    //data.role='model';
    newUser.save(function (err, user) {
      if (err) {
        console.log('err', err);
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 500, error: err}));
      }
      //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
      var data = user.toObject();
      let token=auth.signToken(docs.user['_id']);
        if(token){
          data.access_token=token;
        }
      return ReponseHelper.response(res, 200, HashDataHelper.make(data));
  });
}
function createModelV2(docs,req,res){
  var newUser = new UserModel(docs.user);
    newUser.role='clairvoyant';
    newUser.save(function (err, user) {
      if (err) {
        console.log('err', err);
        return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 500, error: err,msg:err.message}));
      }
      req.user={
        _id:user._id,
      };
      uploadAudioV2(user,req,res,(err,file)=>{
      //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
          user.audio=file;
          user.save((err,document)=>{
            var data = document.toObject();
            let token=auth.signToken(user._id);
              if(token){
                data.access_token=token;
              }
            return ReponseHelper.response(res, 200, HashDataHelper.make(data));
          })
      });
  });
}
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function uploadAudioV2(user,req,res,callback) {
  var mask = '0777';
  var fileName = (new Date().getTime()) + path.extname(req.files.audio.originalFilename);
  var audio  = req.files.audio;
  console.log("audio file");
  console.log(audio);
  mkdirp(config.audioPath+req.user._id, mask).then(made => {    
    var newpath = config.audioPath+req.user._id+'/' + fileName;
    fs.readFile(req.files.audio.path,  (err, data) => {
      console.log("data of audio");
      console.log(data);
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
            console.log("new path:+ " +newpath);
            FileHelper.ensureDirectoryExistence(newpath);
						fs.writeFile(newpath, data, (err)=> {
							if (err) {
                console.log(err);
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

/** Forget password */
exports.forgetPassword= (req,res)=>{
  var input=req.body;  
  //console.log(input);  
  async.waterfall([  
      function(done) {  
          crypto.randomBytes(20, function(err, buf) {  
              var token = buf.toString('hex');  
              done(err, token);  
          });  
      },  
      function(token, done) {   
              var dbo = db.db("Here is your DB Name");  
              //console.log(req.body.Email);  
              var query = { Email : req.body.email ,isDeleted:false};  
              UserModel.findOne(query).exec(function(err,result){  
                  if(result){  
                      var errMsg={
                        message:"Email not found",
                        type:'error'
                      }
                      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 402, error: errMsg}));
                  }  
                  var myquery = { Email: result.Email };  
                  var newvalues = { $set: {resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 }};  
                  UserModel.updateOne(myquery, newvalues, function(err, res) {  
                      if (err){
                        var errMsg={
                          message:"Email not found",
                          type:'error'
                        } 
                        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 402, error: errMsg}));
                      }  
                      console.log("1 document updated");  
                  });  


                 // console.log(result[0].Email);  
                  done(err, token, result);  
              });    
      },  
      function(token, result, done,Username,password) {  
          var emailVal = result.email;  
          console.log(emailVal);  
          var Username="";  
          var password="";  
          MongoClient.connect(url, function(err, db){   
          var dbo = db.db("Here willbe your db name");  
          dbo.collection('Accountsettings').find().toArray(function(err,result){  
              if (err) throw err;  
              Username=result[0].UserName;  
              password=result[0].Password;  
             // console.log(Username);  
             // console.log(password);  
                 // res.json({status : 'success', message : 'Records found', result : result});  


          // console.log(Username);  
          var smtpTransport = nodemailer.createTransport({  
              service: 'SendGrid',  
              auth: {  
                user: Username,  
                pass: password  
              }  
            });  

          const mailOptions = {  
              to: emailVal,  
              from: 'passwordreset@demo.com',  
              subject: 'Password Reset',  
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
                  'http://' + config.backendUrl + '/reset/' + token + '\n\n' +  
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
          };  
          smtpTransport.sendMail(mailOptions, function(err) {                 
              console.log("HI:"+emailVal);  
              res.json({status : 'success', message : 'An e-mail has been sent to ' + emailVal + ' with further instructions.'});              
              done(err, 'done');  
          });  
      })  
      });  
      }  

  ], function(err) {  
      if (err) return next(err);  

  });  
}  

/** Set password  */
exports.setpasswordResponsemail = function(req, res) {  
  async.waterfall([  
      function(done) {  
         UserModel.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() },isDeleted:false }, function(err, user) {  
                  if (!user) {  

                      var msgRes={message: 'Password reset token is invalid or has expired.'};  
                      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: msgRes}));
                  }  
                  //console.log(user);  
                  var myquery = { resetPasswordToken: req.params.token };  
                  var newvalues = { $set: {Password: req.body.Password,resetPasswordToken: undefined, resetPasswordExpires: undefined, modifiedDate : Date(Date.now()) }};  
                  UserModel.updateOne(myquery, newvalues, function(err, result) {  
                      if (err) {
                        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                      }  
                      //console.log("result ======" + result);  
                      console.log("1 document updated");  
                  });  
                  done(err, user);  
              });  
          },
      function(user, done) {  
          MongoClient.connect(url, function(err, db){   
              var dbo = db.db("Your db name goes here");  
              var Username="";  
              var password="";  
              dbo.collection('Accountsettings').find().toArray(function(err,result){  
                  if (err) throw err;  
                  Username=result[0].UserName;  
                  password=result[0].Password;  
              })  
          })  
          var smtpTransport = nodemailer.createTransport({  
              service: 'SendGrid',  
              auth: {  
                  user: Username,  
                  pass: password  
              }  
          });  
          var mailOptions = {  
              to: user.Email,  
              from: 'passwordreset@demo.com',  
              subject: 'Your password has been changed',  
              text: 'Hello,\n\n' +  
                  'This is a confirmation that the password for your account ' + user.Email + ' has just been changed.\n'  
          };  
          smtpTransport.sendMail(mailOptions, function(err) {  
              res.json({status : 'success', message : 'Success! Your password has been changed.'});  
              done(err);  
          });  
      }  
  ], function(err) {  
      if (err) return err;  
  });  
} 

exports.deleteUser=function(req,res){
    var query=UserModel.update({_id:req.params.id},{$set:{isActive:false,isDeleted:true}});
    query.exec((err,userDoc)=>{
      if (err) {
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: {type:'errors',message:"Can't not remove user"}}));
      }
      return ReponseHelper.response(res, 200, HashDataHelper.make(userDoc));

    });
}

exports.deleteUsers=(req,res)=>{
  console.log(req.body.listUser);
  var listUserId=req.body.listUser;
 
  async.waterfall([
    (done)=>
    {
      listUserId.map((item,index)=>{
        if(item != '' && item != null)
        {
          try
          {
            listUserId[index]= mongoose.Types.ObjectId((item.toString()));
          }
          catch($e)
          {
            console.log("err");
            console.log($e);
          }
          
        }
        else{
          listUserId.splice(index,1);
        }
    
      });
      done(null,listUserId);
    },
    (listUserId,done)=>
    {
      console.log('list');
      console.log(listUserId);
      var query=UserModel.updateMany({
        '_id': { $in:listUserId}
        },{$set:{isActive:false,isDeleted:true},});
      query.exec(function(err, docs){
        console.log(docs);
        return ReponseHelper.response(res, 200, HashDataHelper.make(docs));
        done('completed');
    });

    }
  ],(err)=>{
    console.log(err);
    return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,err,[],'ERR_INPUT'));
  })
 
}

exports.active=(req,res)=>{
  console.log('run active');
  UserModel.findById(req.params.id,(err,user)=>{
    if(err){
      console.log(err);
      return ;
    }
    else{
      if(user){
       var myquery = { _id: user._id };  
           var newvalues = { $set: {isActive: true }};  
           UserModel.updateOne(myquery, newvalues, function(err, usrRes) {  
               if (err){
                 var errMsg={
                   message:"Email not found",
                   type:'error'
                 }
                 console.log(err); 
                 return;
               }  
               return ReponseHelper.response(res, 200, HashDataHelper.make(usrRes));
           });  
      }
    }
  })
}

exports.deActive=(req,res)=>{
  UserModel.findById(req.params.id,(err,user)=>{
    if(err){
      console.log(err);
      return ;
    }
    else{
      if(user){
       var myquery = { _id: user._id };  
           var newvalues = { $set: {isActive: false }};  
           UserModel.updateOne(myquery, newvalues, function(err, usrRes) {  
               if (err){
                 var errMsg={
                   message:"Email not found",
                   type:'error'
                 }
                 console.log(err); 
                 return;
               }  
               return ReponseHelper.response(res, 200, HashDataHelper.make(usrRes));
           });  
      }
    }
  })
}

exports.deActiveList=(req,res)=>{
  console.log(req.body.listUser);
  var listUserId=req.body.listUser;
 
  async.waterfall([
    (done)=>
    {
      listUserId.map((item,index)=>{
        if(item != '' && item != null)
        {
          try
          {
            listUserId[index]= mongoose.Types.ObjectId((item.toString()));
          }
          catch($e)
          {
            console.log("err");
            console.log($e);
          }
          
        }
        else{
          listUserId.splice(index,1);
        }
    
      });
      done(null,listUserId);
    },
    (listUserId,done)=>
    {
      console.log('list');
      console.log(listUserId);
      var query=UserModel.updateMany({
        '_id': { $in:listUserId}
        },{$set:{isActive:false},});
      query.exec(function(err, docs){
        console.log(docs);
        return ReponseHelper.response(res, 200, HashDataHelper.make(docs));
        done('completed');
    });

    }
  ],(err)=>{
    console.log(err);
    return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,err,[],'ERR_INPUT'));
  })
 
}


exports.activeList=(req,res)=>{
  var listUserId=req.body.listUser;
 
  async.waterfall([
    (done)=>
    {
      listUserId.map((item,index)=>{
        if(item != '' && item != null)
        {
          try
          {
            listUserId[index]= mongoose.Types.ObjectId((item.toString()));
          }
          catch($e)
          {
            console.log("err");
            console.log($e);
          }
          
        }
        else{
          listUserId.splice(index,1);
        }
    
      });
      done(null,listUserId);
    },
    (listUserId,done)=>
    {
      var query=UserModel.updateMany({
        '_id': { $in:listUserId}
        },{$set:{isActive:true},});
      query.exec(function(err, docs){
        console.log(docs);
        return ReponseHelper.response(res, 200, HashDataHelper.make(docs));
        done('completed');
    });

    }
  ],(err)=>{
    console.log(err);
    return ReponseHelper.response(res, 200, HashDataHelper.makeError(422,err,[],'ERR_INPUT'));
  })
 
}

