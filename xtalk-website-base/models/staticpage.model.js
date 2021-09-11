'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  var StaticPageSchema = new Schema({
      title:{type:Schema.Types.String,require},
      content:{type:Schema.Types.String,require},
      slug:{type:Schema.Types.String,require},
      isDeleted:{type:Schema.Types.Boolean,default:false},
      createdAt: {type: Date, default: Date.now},
      updatedAt: {type: Date, default: Date.now},
  })

  module.exports=mongoose.model('StaticPage',StaticPageSchema);