var _ = require('lodash');
exports.validateLogin = function (req, callback) {
  req.checkBody('email', 'Email is required.').notEmpty();
  if(!validateEmail(req.body.email)){
    req.checkBody('email', 'Invalid phone number entered.').isNumber();
  }else if(!isNumber(req.body.email)){
    req.checkBody('email', 'Invalid email entered.').isEmail();
    req.checkBody('email', 'Email must be smaller than 50 characters.').len(0, 50);
  }else{
    return callback('Invalid email or phone number entered')
  }
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password', 'Password must be smaller than 16 characters.').len(0, 16);
      
  return callback(req.validationErrors(), _.pick(req.body, 'email', 'password','remember'));  
};
exports.validateForgotPass = function (req, callback) {
    console.log(req.body);
    req.checkBody('email', 'Invalid email entered.').isEmail();
    req.checkBody('email', 'Email must be smaller than 50 characters.').len(0, 50);

      
  return callback(req.validationErrors(), _.pick(req.body, 'email'));  
};
function isNumber(input){
    var re = /^\d+$/;
    return re.test(input)
}
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}