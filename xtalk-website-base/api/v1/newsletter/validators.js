var _ = require('lodash');
exports.create = function (req, callback) {
  req.checkBody('email', 'email required.').notEmpty();
  //req.checkBody('phone','phone number required').notEmpty();

  var data = _.pick(req.body, ['email']);

  data = _.each(data, function (o) {
    _.each(o, function (v, k) {
      o[k] = v.trim();
    });
  });
  return callback(req.validationErrors(), data);
};