'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PageConfigSchema = new Schema({
    logo: {
        type:{type:String,default:'image'},
        data:{type:String,default:'logo.png'}
    },
    currency:{ type: String,default:'$' },
    footer: { type: String,default:'Copyright © 2018 Sexy Talk.' },
    fb	:{type:String},	
    gg	:{type:String},
    price:{type:Number,default:10},
    twitter	:{type:String,default:'1'},
    faviconLink:{type:String,default:''},
    googleCode:{type:String,def:''},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('PageConfig', PageConfigSchema);
