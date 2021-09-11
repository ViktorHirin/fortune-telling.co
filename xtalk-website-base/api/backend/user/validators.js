var _ = require('lodash');
var UserModel = require('../../../models/user.model');
exports.validateCreate = function (req, callback) {
  req.checkBody('firstName', 'first name required.').notEmpty();
  req.checkBody('email', 'email required.').notEmpty();
  req.checkBody('password','password required').notEmpty();
  req.checkBody('lastName','last Name required').notEmpty();
  //req.checkBody('phone','phone number required').notEmpty();
  
  var data = _.pick(req.body, ['firstName', 'email', 'password','lastName','phone']);

  data = _.each(data, function (o) {
    _.each(o, function (v, k) {
      o[k] = v.trim();
    });
  });
  return callback(req.validationErrors(), data);
};

exports.validateCreateModel = function (req, callback) {
  //req.checkBody('user._id', 'User not login.').notEmpty();
  req.body.user=JSON.parse(req.body.user);
  console.log(req.body.user);
  req.checkBody('user.firstName', 'first name required.').notEmpty();
  req.checkBody('user.email', 'email required.').notEmpty();
  req.checkBody('user.password','password required').notEmpty();
  req.checkBody('user.lastName','last Name required').notEmpty();
  req.checkBody('user.phone','phone number required').notEmpty();
  req.checkBody('user.about', 'about required.').notEmpty();
  req.checkBody('user.interests').notEmpty();
  req.checkBody('user.specialities').notEmpty();
  // req.checkBody('foreName').notEmpty();
  req.checkBody('user.category').notEmpty();
  req.checkBody('user.specialities').notEmpty();
  var data = _.pick(req.body, ['user.phone','user.category','user.password','user.about','user.role', 'user.interests', 'user.specialities','user.firstName','user.lastName','user.password','user.email']);
  UserModel.find({email:req.body.user.email},(err,userDocs)=>{
      if(err || userDocs._id)
      {
        return callback('The email has already been taken.', data);
      }
      else
      {
        return callback(req.validationErrors(), data);
      }
      
  })
 
};
exports.validateUpdate = function (req, callback) {
  req.checkBody('user', 'user name required.').notEmpty();
 //req.checkBody('user.age').notEmpty();
  let user=JSON.parse(req.body.user);
  var data = _.pick(user, ['id','gender','age','token', 'orientation', 'about','location','phone','service','languages','doNotDisturb','interests','specialities','firstName','lastName','email', 'category']);
  console.log(data);
  // if(data.twitterUrl){
	//   data.social.twitterUrl = data.twitterUrl;
  // }
  // if(data.tiktokUrl){
	//   data.social.tiktokUrl = data.tiktokUrl;
  // }

  data = _.each(data, function (o) {
    _.each(o, function (v, k) {
      if(typeof v === 'string' || v instanceof String)
        o[k] = v.trim();
    });
  });
  return callback(req.validationErrors(), data);
};
exports.validateLogin = function (req, callback) {
  req.checkBody('email', 'email required.').notEmpty();
  req.checkBody('password').notEmpty();
  var data = _.pick(req.body, ['email', 'password']);
  data = _.each(data, function (o) {
    _.each(o, function (v, k) {
      o[k] = v.trim();
    });
  });
  return callback(req.validationErrors(), data);
};


