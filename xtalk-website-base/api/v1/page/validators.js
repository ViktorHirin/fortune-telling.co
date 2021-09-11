'use strict'
var _ = require('lodash');

exports.validateCreate = function (req, callback) {
  req.checkBody('pageconfig', 'data not found').notEmpty();
  req.checkBody('content', 'content required.').notEmpty();
  req.checkBody('rating','phone number required').notEmpty();
  var data = _.pick(req.body.pageconfig, ['footer', 'fb', 'gg','price','twitter','faviconLink','googleCode','currency']);
  return callback(req.validationErrors(), data);
};
