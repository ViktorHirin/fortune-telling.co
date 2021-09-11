'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
//var okay = require('okay');
var authTypes = ['twitter', 'facebook', 'google'];
var _ = require('lodash');
var CategorySchema = {
	_id: Schema.Types.ObjectId,
	//thumbnail, size...
	name: {
		type: String
	},
	slug: {
		type: Number
	}
};

module.exports = mongoose.model('Category', CategorySchema);
