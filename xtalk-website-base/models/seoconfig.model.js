'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SeoConfigSchema = new Schema({   
    title: { type: String,default:'Xtalk Talk.' },
    description	:{type:String,default:'Webcam modeling with Sexy Talk is an exciting way to make good money from the comfort and safety of your home.'},	
    gg	:{type:String},
    keyword:{type:String,default:'Xtalk Sexy'},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('SeoConfig', SeoConfigSchema);
