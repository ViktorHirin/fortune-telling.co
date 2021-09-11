var nodemailer = require('nodemailer'),
  htmlToText = require('nodemailer-html-to-text').htmlToText,
  smtpTransport = require('nodemailer-smtp-transport'),
  sgTransport = require('nodemailer-sendgrid-transport');
  config = require('./../config/config'),
  okay = require('okay'),
  path = require('path'),
  _ = require('lodash'),
  viewsPath = '../storages/template-emails/',
  swig = require('nunjucks');
  sgMail = require('@sendgrid/mail')
  


function Mailer(options,service) 
{
  this.type="smpt";
  this.service = service;
  if(config.mailer.service == "sendgrid")
  {
    this.type="sendgrid";
    MailerSendGrid(config.mailer.auth.auth);
  }
  else
  {
    this.transport = nodemailer.createTransport(options);
  }
};
function MailerSendGrid(auth)
{
  this.type="sendgrid";
  sgMail.setApiKey(auth.pass);
}
Mailer.prototype.render = function(template, options, callback) {
  swig.render(path.join(__dirname, viewsPath, template), options || {}, callback);
};

Mailer.prototype.send = function(options, callback) {
 
  if(this.type== 'sendgrid')
  {
     var options = options || {}; 
  _.defaults(options, {
    from : config.mailer.auth.auth.user||"hai.truong@hoanvusolutions.com",
  websiteName:config.websiteName,
  baseUrl:config.baseUrl,
    bcc : config.bccEmails || []
  });
    sgMail
    .send(options)
    .then((data) => {
      console.log('Email sent');
      callback && callback(null, data);

    })
    .catch((error) => {
      console.error(error)
    })
  }
  else
  {
     var options = options || {}; 
  _.defaults(options, {
    from : config.emailFrom,
  websiteName:config.websiteName,
  baseUrl:config.baseUrl,
    bcc : config.bccEmails || []
  });
  this.transport.sendMail(options, okay(callback, function(data){
    callback && callback(null, data);
  }));
  }
};

Mailer.prototype.sendMail = function(template, emails, options, callback) {
  var self = this;
  options.websiteName = config.websiteName;
  options.baseUrl = config.baseUrl;
  console.log('Mailer send email `'+options.subject+'` to',emails);
  self.render(template, options, okay(callback, function(output) {
    self.send({
      to : emails,
      subject : options.subject,
      html : output
    }, callback);
  }));
};

Mailer.prototype.close = function() {
  this.transport.close();
};
var mailer;
 if(config.mailer.service == 'sendgrid')
 {
   mailer = new Mailer(config.mailer.auth.auth);  
 }
 else
 {
    mailer = new Mailer(smtpTransport(config.mailer.auth));
 }
module.exports = mailer;