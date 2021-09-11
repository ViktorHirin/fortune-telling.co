'use strict'
var NewsLetter = require('../../../models/newsletter.model');

const {result} = require('lodash')
var validator = require('./validators');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');

exports.create = (req, res) => {
  validator.create(req, async (err, data) => {
    if (err) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    try {
      let newletter = await NewsLetter.findOne({email: data.email});
      if (newletter) {
        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: 'You have already registered'}));
      }
      newletter = new NewsLetter();
      newletter.email = data.email;
      await newletter.save();
      return ReponseHelper.response(res, 200, HashDataHelper.make(newletter));

    } catch (e) {
      return ReponseHelper.response(res, 200, HashDataHelper.makeError({status: 422, msg: e.message}));
    }
  });

}
