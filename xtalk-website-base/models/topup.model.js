'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TopUpSchema = new Schema({
	price: { type:Number,required:true },
    description: { type: String,default:'' },
    token:{ type:Number,require:true},
    flexformId:{type:String,required:true},
    name:{type:String,required:true,unique: true},
    formName:{type:String},
    formPrice:{type:String},	
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
});
module.exports = mongoose.model('TopUp', TopUpSchema);
