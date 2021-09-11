var _ = require('lodash');
exports.validateUpdate = function (req, callback) {
    req.checkBody('name', 'option name required.').notEmpty();
    req.checkBody('value', 'option value required.').notEmpty();
    //req.checkBody('phone','phone number required').notEmpty();
    
    var data = _.pick(req.body, ['name', 'value']);
  
    data = _.each(data, function (o) {
      _.each(o, function (v, k) {
        o[k] = v.trim();
      });
    });
    return callback(req.validationErrors(), data);
  };