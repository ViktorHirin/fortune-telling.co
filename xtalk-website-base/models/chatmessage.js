'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
	type:{type: String, default: 'text'},
	//conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
	roomId: { type: String },
	from: { type: Schema.Types.ObjectId, ref: 'User' },
	to: { type: Schema.Types.ObjectId, ref: 'User' },
    streamingTime: {type:Number, default:0},
	text:{type:String, default:''},
	readFlag:{type:Boolean,default:false},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	ref:{ type: Schema.Types.ObjectId, ref: 'User' },
	ref:{ type: Schema.Types.ObjectId, ref: 'Conversation' }

});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
