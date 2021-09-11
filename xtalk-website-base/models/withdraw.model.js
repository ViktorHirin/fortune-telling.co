'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WithDrawSchema = new Schema({
  amount: {type: Number, required: true}, 
  status: {type: String, enum: ['pending', 'approved', 'reject']},
  token: {type: Number, required: true},
  rate: {type: Number},
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  isDeleted: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});
module.exports = mongoose.model('withdraw', WithDrawSchema);
