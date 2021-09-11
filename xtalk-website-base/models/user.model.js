'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
//const uniqueValidator = require('mongoose-unique-validator')
var okay = require('okay');
var authTypes = ['twitter', 'facebook', 'google'];
var _ = require('lodash');
var FileSchema = {
	_id: Schema.Types.ObjectId,
	//thumbnail, size...
	mimeType: {
		type: String
	},
	size: {
		type: Number
	},
	fileUrlBase:{
		type:String
	},
	fileName:{
		type:String
	},
	baseName: {
		type: String
	},
	  path: {
		type: String,
	  },
	pathDir:{
		  type: String
	}
};
var EventBus = require('../components/EventBus');
var UserSchema = new Schema({
  	userId:{type: String, lowercase: true},
	orientation: String,
	age:{type:Number},
	firstName: {type:String,default:'',required:true},
	phone:{
		number:{type:String},
		internationalNumber:{type:String},
		nationalNumber:{type:String},
		e164Number:{type:String},
		countryCode:{type:String},
		dialCode:{type:String}
	},
	twilioPhone:{type:String},
	lastName: {type:String,default:'',required:true},
	foreName:{type:String,default:''},
	userName:{type:String,default:''},
	email: {type: String, lowercase: true,required:true},
	emailVerified: {type: Boolean, default: false},
	emailVerifyExpired:{type: Date},
	emailVerifyToken: {type:String,default:''},
	role: {type:String,default:'clairvoyant',enum: ['member', 'clairvoyant','admin']},
	status: {type: Boolean, default:false},
	isActive:{type: Boolean, default: false},
	isPublic:{type: Boolean, default: true},
	isCreator:{type: Boolean, default: false},
	isDeleted:{type: Boolean, default: false},
	isCalling:{type: Boolean, default: false},
	allowEarn:{type: Boolean, default: false},
	paymentCard:{type: Object, default:{}},
	avatar: FileSchema,
	avatarSM: FileSchema,
	avatarMD: FileSchema,
	wallImage:FileSchema,
	hashedPassword: String,
	category:{type:String,default:'male',enum: ['male', 'female','couples']},
	gender:{ type:String,default:'man',enum:['woman','man','other']},
	passwordResetToken: {type:String},
	passwordResetExpired:{type: Date},
	about: {type:String,default:''},
	interests:{type:String,default:''},
	specialities:{type:String,default:''},
	audio: FileSchema,
	languages:{type:String,default:''},
	service:{type:String,default:''},
	location: {
		city:{type:String,default:''},
		stress:{type:String,default:''},
		location:{type:String,default:''}
	},
	social:{
		twitterUrl:{type:String,default:''},
		tiktokUrl:{type:String,default:''},
		instagramUrl:{type:String,default:''}
	},
	freeToken:{type:Number,default:0},
	token:{type:Number,default:0},
	rating:{type:Number,default:0},
	salt: String,
	facebook: {type: Object, default:{}},
	google: {type: Object, default:{}},
	showActivityStatus:{type: Boolean, default: true},
	showSubOffers:{type: Boolean, default: true},
	allowCoStreamRequests:{type: Boolean, default: false},
	lastLogin: {type: Date, default: Date.now},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	doNotDisturb:{type:Boolean,default:false},
	ref:{ type: Schema.Types.ObjectId, ref: 'User' }
});

//UserSchema.plugin(uniqueValidator)

/**
 * Index
 * 
 */
UserSchema.index({firstName: 'text', lastName: 'text'});


/**
 * Virtuals
 */
UserSchema
				.virtual('password')
				.set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashedPassword = this.encryptPassword(password);
})
				.get(function() {
	return this._password;
});

// UserSchema.path('token')
// .set(function(token) {
// 	if(token < 0)
// 	{
// 		this.token = 0;
// 	}
// 	else{
// 		this.token = token;
// 	}
// })
UserSchema
	.virtual('publicProfile')
	.get(function() {
		return {
			'name': this.name,
			'avatar': this.avatar,
			avatarUrl: this.avatar ? this.avatar.fileUrl : '',
			audioUrl: this.audio ? this.audio.fileUrl : '',
			avatarBaseUrlSM: this.avatarSM ? this.avatar.fileUrlBase : '',
			avatarUrlSM: this.avatarSM ? this.avatarSM.fileUrl : '',
			avatarUrlMD: this.avatarMD ? this.avatarMD.fileUrl : '',
			createdAt:this.createdAt,
			updatedAt:this.updatedAt
		};
});




/**
 * Validations
 */





// Validate email is not taken
UserSchema.path('email').validate(function(value,respond) {
	var self = this;
	this.constructor.findOne({$and: [
			{email: value.toLowerCase()},
			{isDeleted:false,},
			{email: {$ne: null}}
		]}, function(err, user) {
		if (err)
			throw err;
		if (user) {
			if (self._id.toString() == user._id.toString())
				return respond(true);
			return respond(false);
		}
		return respond(true);
	});
}, 'This email is taken. Please choose another.');

UserSchema.path('phone.e164Number').validate(function(value,respond) {
	var self = this;
	if(value && self.role=='clairvoyant')
	{
		this.constructor.findOne({$and: [
			{
		   "phone.e164Number": value,
		   "role":'clairvoyant'
		   },
		   {
			   phone: {
				   $ne: null
			   }
		   }
	   ]}, function(err, user) {
	   if (err)
		   throw err;
	   if (user) {
		   if (self._id.toString() == user._id.toString())
			   return respond(true);
		   return respond(false);
	   }
	   return respond(true);
  	 });
	}
	else
		{
			if(self.role == 'clairvoyant')
			{
				return respond(false);
			}
			return respond(true);
		}
}, 'This phone number is taken. Please choose another.');


var validatePresenceOf = function(value) {
	return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
				.pre('save', function(next) {
  	// if(!this.userId){
  	// this.userId = this.email ? this.email : this.phoneNumber;
  	// }
	
	this.wasNew = this.isNew;

  if (this.isNew && !this.emailVerified) {
		//create email verify token
		this.emailVerifyToken = crypto.randomBytes(6).toString('hex').substring(0, 6);
		this.emailVerifyExpired=new Date();
		this.emailVerifyExpired.setHours(this.emailVerifyExpired.getHours()+ 3);
	}

	next();
});

UserSchema.post('save', function(doc) {
//	var evtName = this.wasNew ? 'User.Inserted' : 'User.Updated';
	
	//EventBus.emit(evtName, doc);
});
UserSchema.post('save', function(doc) {
	var evtName = this.wasNew ? 'User.Inserted' : 'User.Updated';
	console.log('run emit envent ');
	EventBus.emit(evtName, doc);
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashedPassword;
	},
	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.randomBytes(16).toString('hex');
	},
	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	encryptPassword: function(password) {
		if (!password || !this.salt)
			return '';

		return crypto.createHash('md5').update(password.toString()).digest("hex");
	},

	
	/**
	 * Return public attr
	 * @returns {object}
	 */
//	toJSON: function() {
//		var json =  this;
//   json.avatarBaseUrlSM = this.avatarSM ? this.avatarSM.fileUrlBase : '';
//    json.avatarUrl = this.avatar ? this.avatar.fileUrl : '';
//    json.avatarUrlSM = this.avatarSM ? this.avatarSM.fileUrlBase : '';
//    json.avatarUrlMD = this.avatarMD ? this.avatarMD.fileUrlBase : '';
//		json.google = this.google;
//    delete json._v;
//		return this;
//	}
};
UserSchema.set('toObject', { getters: true });
UserSchema.set('toJSON', { getters: true,virtual:true });
UserSchema.methods.confirmEmail = function(callback) {
	//remove keychain and update email verified status
	this.emailVerifyToken = null;
	this.emailVerifyExpired = null;
	this.emailVerified = true;
	this.isActive=true;
	console.log("run confirmEmail");
	this.save(okay(callback, function(updatedUser) {
		callback(null, updatedUser);
	}));
	//callback();
};

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = basicProfile;
function basicProfile(doc,ret,options){
  
  delete ret.hashedPassword;
  var result = {};
  if (ret.role == 'clairvoyant')
  {
    result.category = ret.category;
  }

  ret.location = ret.location || {city: '', phone: ''};
  ret.avatarBaseUrlSM = ret.avatarSM ? config.backendUrl + '/' + ret.avatarSM.fileUrlBase : config.avatarBaseUrl;
  ret.avatarUrl = ret.avatar ? config.backendUrl + '/' + ret.avatar.fileUrlBase : config.avatarBaseUrl;
  ret.avatarPath = ret.avatar ? ret.avatar.fileUrlBase : '/assets/images/img.jpg';
  ret.wallImage = ret.wallImage ? config.backendUrl + '/' + ret.avatar.fileUrlBase : config.wallBaseUrl;
  ret.audioUrl = ret.audio ? config.backendUrl + '/' + ret.audio.fileUrlBase : '';
  ret.hasAvatar = ret.avatar ? true : false;
  ret.role=ret.role;
  return ret;
}
if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {}
UserSchema.options.toJSON.transform = basicProfile;
module.exports = mongoose.model('User', UserSchema);
