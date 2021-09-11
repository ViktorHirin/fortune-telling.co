'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var config = require('../config/config');

var FileSchema = new Schema({
  type: {
    type: String, // filename
    required: true
  },
	fileName:{
		type:String
	},
	baseName: {
		type: String
	},
	fileUrl:String,
	fileUrlBase:String,
	path: {
		type: String,
		required: true // path to server
	},
	pathDir:{
		  type: String
	},
	parentId: {
		type: Schema.Types.ObjectId,
		ref: 'File'
	},
	thumbType: {
		type: String,
		default: 'full'
	},
  mimeType: {
    type: String
  },
  size: {
    type: Number
  },
  userId: {// user object
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * file before save
 * @param {type} param1
 * @param {type} param2
 */
FileSchema.pre('save',function(next){
    if (this.path)
    {
      var userId = typeof this.userId._id !=='undefined'? this.userId._id:this.userId;
      this.fileUrlBase = 'uploads/' + this.type + '/' + userId + '/' + this.fileName;
    }
  next();
});
// Validate email is not taken
FileSchema.path('type').validate(function(value,next){
 if(this.type == 'gallery')
 {
  var data=this.constructor.find({
    userId:this.userId,
    type:"gallery"
  }).limit(5);
  data.exec((err,fileData)=>{
    console.log(Object.keys(fileData).length);
    if(Object.keys(fileData).length == 5 )
    {
      return next(false);
    }
    return next(true);
  });
 }
 return next(true);
},'Limit count gallery');




module.exports = mongoose.model('File', FileSchema);