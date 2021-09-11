var _ = require('lodash');
exports.isEmail = function (text) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(text);
};
exports.isNumber = function (text) {
  var re = /^\d+$/;
  return re.test(text)
}
exports.isPhone = function(phoneNumber){
   var re = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
    return re.test(phoneNumber);
};

var isNaNorUndefined = function () {
  var args = Array.prototype.slice.call(arguments);
  return args.some(function (arg) {
    return isNaN(arg) || (!arg && arg !== 0);
  });
};


