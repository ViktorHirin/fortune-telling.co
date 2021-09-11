'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OptionsSchema = new Schema({
  option_name: {type: String, required: true},
  option_value: {type: String, required: true},
  autoload: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});


module.exports = mongoose.model('options', OptionsSchema);
