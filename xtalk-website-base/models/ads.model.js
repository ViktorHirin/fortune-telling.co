'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var Ads = new Schema({
    postion: {  type: String,enum:['top','footer', 'middlwae'],default:'top'},
    type:{ type: String,enum:['text','image','video'],default:'image'},
    description:{type:String,default:''},
    file:{type:Schema.Types.ObjectId,ref:'File',required:true},
    title:{type:String},
    isActived:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
});
module.exports = mongoose.model('ads', Ads);
