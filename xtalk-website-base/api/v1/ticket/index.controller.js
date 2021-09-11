'use strict'
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var Ticket=require("../../../models/ticket.model");
var Validator= require('./validators');

exports.putTicket=(req,res)=>
{
   console.log(req.body);
   Validator.validateCreate(req, function (err, data) {
    if (err) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
    }
    var newTicket = new Ticket(data);
    newTicket.save((errSave,product)=>{
        if(errSave)
        {
            console.log(errSave);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: errSave.message}));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(product));
    })
    });
}

