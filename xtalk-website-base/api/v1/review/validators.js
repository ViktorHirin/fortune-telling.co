'use strict'
var _ = require('lodash');

exports.validateCreate = function (req, callback) {
  req.checkBody('userId', 'User Id required.').notEmpty();
  req.checkBody('content', 'content required.').notEmpty();
  req.checkBody('rating','phone number required').notEmpty();
  var data = _.pick(req.body, ['userId', 'content', 'rating','reviewerId']);

//   data = _.each(data, function (o) {
//     _.each(o, function (v, k) {
//       o[k] = v.trim();
//     });
//   });
  return callback(req.validationErrors(), data);
};
