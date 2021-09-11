'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ReviewSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating:{ type:Number,require,},
	content:{type:String, default:''},
	createdAt: {type: Date, default: Date.now},
	isDeleted:{type:Boolean,default:false},
	updatedAt: {type: Date, default: Date.now},
});
module.exports = mongoose.model('Review', ReviewSchema);
