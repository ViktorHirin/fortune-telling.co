/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mailer = require('../components/Mailer');
var EventBus = require('../components/EventBus');
var config = require('../config/config');
const PageConfig=require('../models/pageconfig.model');

var request = require('request'),
	path = require('path'),
	fs = require('fs');
var baseUrl=config.backendUrl;
var frontendUrl=config.fontendUrl;
EventBus.onSeries('User.ForgotPassword', function (data, next) {
	Mailer.sendMail('forgot-password.html', data.user.email, {
		user: data.user,
		baseUrl: baseUrl,
		websiteName: config.websiteName,
		forgotLink: frontendUrl + '/response-reset/' + data.resetToken,
		subject: 'Password change request'
	}, function (err, data) {
		if (err) {
			console.log(err);
		}
		next();
	});
});
EventBus.onSeries('User.Inserted', function (user, next) {
	var confirmUrl = config.backendUrl + '/api/v1/auth/confirm-email/' + user.emailVerifyToken;
	console.log('run send email');
	console.log(confirmUrl);
	sendConfirmEmail(user, confirmUrl, next);
});

EventBus.onSeries('Ticket.Inserted', function (ticket, next) {
	sendTicketEmail(ticket,next);
});

function sendConfirmEmail(user, confirmUrl, next) {
	PageConfig.findOne({},(err,pageConfig)=>{
		if(err)
		{
			console.log('err get page config');
			console.log(err);
		
		}
		else
		{
			Mailer.sendMail('confirm-email.html', user.email, {
				user: user,
				baseUrl: baseUrl,
				adminEmail:config.adminEmail,
				websiteName: config.websiteName,
				logo: baseUrl +'/'+pageConfig.logo.data,
				confirmation: confirmUrl,
				code: user.emailVerifyToken,
				subject: 'Welcome to '+ config.websiteName,
			}, function (err) {
				if (err) {
					console.log('[Error] Send mail verify', err);
				}
				return next && next(err);
		
			});
		}
	});
	
}

function sendTicketEmail(ticket, next) {
	console.log('log send ticket');
	console.log(ticket);
	Mailer.sendMail('ticket.html', config.adminEmail, {
		email: ticket.email,
		name:ticket.name,
		date: ticket.createdAt,
		content: ticket.description,
		phone: ticket.phone,
		subject: 'New Support Request',
		subjectMsg:ticket.subject
	}, function (err) {
		if (err) {
			console.log('[Error] Send mail new ticket', err);
		}
		return next && next(err);

	});
}