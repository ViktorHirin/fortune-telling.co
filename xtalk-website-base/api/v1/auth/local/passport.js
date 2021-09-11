var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
		console.log('email',email);
      User.findOne({ 
         email: email.toLowerCase(),

      }, function(err, user) {
		
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'Email / phone number / password combination is incorrect. Please try again.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Email /phone number / password combination is incorrect. Please try again.' });
        }
        //verify email
//        if (!user.emailVerified) {
//          return done(null, false, { message: 'This email is not verified.' });
//        }
        return done(null, user);
      });
    }
  ));
};