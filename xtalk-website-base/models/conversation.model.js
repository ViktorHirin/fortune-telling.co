'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var _ = require('lodash');

var ConversationSchema = new Schema({
	type:{type: String, default: 'chat'},
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
	modelId:{ type: Schema.Types.ObjectId, ref: 'User' },
	id:{type:Schema.Types.String, required: [true,'id required']},
	// isStreaming: {type: Boolean, default: false},
	// lastStreamingTime: {
    //   type: {type: Date},
    // },
	statusConversation: {type:String,default:'pending',enum: ['accepted', 'clairvoyant','admin','pending']},
    //streamingTime: {type:Number, default:0},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	ref:{ type: Schema.Types.ObjectId, ref: 'User' }
});

// Validate email is not taken
ConversationSchema.path('id').validate(function(value,cb) {
	var self = this;
	this.constructor.findOne({$and: [
			{id: value},
			{id: {$ne: null}}
		]}, function(err, room) {
		if (err)
			throw err;
		if (room) {
			if (self._id === room._id)
				return cb(true);
			return cb(false);
		}
		return cb(true);
	});
}, 'The specified roomId is already in use.');
module.exports = mongoose.model('Conversation', ConversationSchema);
