'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PaymentSettingSchema = new Schema({
    name: { type:String,default:'CCBil', unique: true },
    shortname:{ type: String,default:'' },
    description: { type: String,default:'' },
    accountNumber	:{type:String,required:true},	
    subAccount	:{type:String,required:true},
    currencyCode	:{type:String,default:'1'},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('PaymentSetting', PaymentSettingSchema);
