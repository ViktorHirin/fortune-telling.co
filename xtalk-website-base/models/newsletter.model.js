'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var NewsLetter = new Schema({
  email: { type: String, lowercase: true, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('newsLetter', NewsLetter);
