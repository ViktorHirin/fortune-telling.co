var _ = require('lodash');
exports.validateCreate = function (req, callback) {
  req.checkBody('name', 'first name required.').notEmpty();
  req.checkBody('email', 'email required.').notEmpty();
  req.checkBody('description','description required').notEmpty();
  
  var data = _.pick(req.body, ['name', 'email','description','subject','phone']);

  data = _.each(data, function (o) {
    _.each(o, function (v, k) {
      o[k] = v.trim();
    });
  });
  return callback(req.validationErrors(), data);
};
