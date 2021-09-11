'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommissionSchema = new Schema({
  percent: {type: Number, default: '0'},
  type: {type: String, enum: ['total'], default: 'total'},
  //modelId:{ type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});


module.exports = mongoose.model('commission', CommissionSchema);
