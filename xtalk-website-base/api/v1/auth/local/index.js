var express = require('express');
var router = express.Router();
var auth = require('../../../auth.service');
var _ = require('lodash');
var HashDataHelper = require('../../../../helpers/HashDataHelper');

var passport = require('passport');

router.post('/', function (req, res, next) {

  passport.authenticate('local', function (err, user, info) {
	  console.log('asdas',err);
	  console.log('info',info);
    var error = err || info;
	
    if (error)
      return res.status(401).json(error);
    if (!user)
      return res.status(404).json({msg: 'Can not found your information'});

    var token = auth.signToken(user, 1);
	console.log('token',token);
	let data =user.toObject();
	console.log(user.toObject());
    data.token = token;
	
    data = _.omit(data, 'hashedPassword');
    return res.status(200).json(HashDataHelper.make(data));


  })(req, res, next);
});


module.exports = router;
