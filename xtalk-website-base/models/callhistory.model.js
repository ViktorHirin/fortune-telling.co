'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var CallHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    callDuration:{ type: Number,default:0 },
    recordingUrl:{type:String},
    token:{type:Number},
    callStatus:{type:String,default:'completed'},
  //  callsId:{type:String, unique : true, required : true, dropDups: true},
  // new project uncomment above
    callsId:{type:String},
    rating:{type:Number,default:3},
    createdAt: {type: Date, default: Date.now},
	  isDeleted:{type:Boolean,default:false},
	  updatedAt: {type: Date, default: Date.now},
});
module.exports = mongoose.model('CallHistory', CallHistorySchema);
