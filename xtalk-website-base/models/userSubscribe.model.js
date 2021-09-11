'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSubscribeSchema = new Schema({
  userId:{ type: Schema.Types.ObjectId, ref: 'User' },
  subId:{ type: Schema.Types.ObjectId, ref: 'User' },
	ref:{ type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('UserSubscribe', UserSubscribeSchema);
