'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var Bank = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    country: { type: String},
    accountNo:{ type: String},
    nameBank:{type:String},
    name:{type:String},
    routingNumber:{type:String},
    swiftCode:{type:String},
     createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
});
module.exports = mongoose.model('Bank', Bank);
