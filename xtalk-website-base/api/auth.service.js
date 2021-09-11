'use strict';

var config = require('../config/config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../models/user.model');
var validateJwt = expressJwt({ secret: config.sessionSecret });


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      else{
        req.headers.authorization=req.get('Authorization');
      }
      if(req.headers.authorization == null){
        res.send(403);
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    });
}
function getDataLogin() {
	return compose()
		.use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      else{
        req.headers.authorization=req.get('Authorization');
      } 
	  if (req.headers && req.headers.authorization) {
			validateJwt(req, res, next);
		} else {
			next();
		}
     
    })
					// Attach user to request
					.use(function(req, res, next) {
		if (req.user && req.user._id) {
			User.findById(req.user._id, function(err, user) {
				if (err)
					return next(err);
				if (!user)
					return res.send(401);

				req.user = user;
				next();
			});
		} else {
			next();
		}
	});
}


function isAdmin() {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (req.user.role=='admin') {
        next();
      }
      else {
       if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
				next();
			}
			else {
				res.send(403);
			}
      }
    });
}
/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id,remember=true) {
	var expiresIn = 60 * 60 * 8;
	if (remember) {
		expiresIn = 60 * 60 * 24 * 365;
	}
	var token = jwt.sign({ _id: id }, config.sessionSecret, { expiresIn: expiresIn });

  return token;
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id,req.query.remember);
  res.cookie('token', JSON.stringify(token));
	
	var redirectUrl = '/';
	if (typeof req.user.role != 'undefined') {
		if (req.session.redirectUrl) {
			redirectUrl = req.session.redirectUrl;
		}
	}else{
		if (typeof req.session.redirectUrl != 'undefined' && req.session.redirectUrl  !='select-role') {
			redirectUrl = '/select-role?redirect=' + req.session.redirectUrl;
		} else {
			redirectUrl = '/select-role';
		}
	}
	delete req.session.redirectUrl;
  res.redirect(redirectUrl);
}
exports.isAdmin=isAdmin;
exports.isAuthenticated = isAuthenticated;
exports.getDataLogin = getDataLogin;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;