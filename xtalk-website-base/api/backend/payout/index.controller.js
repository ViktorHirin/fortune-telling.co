var _ = require("lodash");
var mongoose = require("mongoose");
//var UserValidator = require('./validators.js');
var HashDataHelper = require("../../../helpers/HashDataHelper");
var ReponseHelper = require("../../../helpers/ReponseHelper");
var FileHelper = require("../../../helpers/FileHelper");
var UserModel = require("../../../models/user.model");
var Review = require("../../../models/review.model");
var Withdraw = require("../../../models/withdraw.model");
var UserSubscribeModel = require("../../../models/userSubscribe.model");
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
var config = require("../../../config/config");
var File = require("../../../models/file.model");
const { result } = require("lodash");
const { authenticate } = require("passport");
var auth = require("../../auth.service");
var nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");
const { DataPipeline } = require("aws-sdk");

exports.getPayout = (req, res) => {
  var pipe = [];
  var condition = { isDeleted: false };
  var match = {
    $match: condition,
  };
  var userId = null;
  if (req.user) {
    userId = req.user._id;
  }
  var project = {
    $project: {
      "users.firstName": 1,
      "users.lastName": 1,
      "users.email": 1,
      "users.token": 1,
      reject: 1,
      approved: 1,
      pending: 1,
      total_count:1,
    },
  };
  var lookup = {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "users",
    },
  };
  var group = {
    $group: {
      _id: "$userId",
      reject: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "reject"],
            },
            "$amount",
            0,
          ],
        },
      },
      approved: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "approved"],
            },
            "$amount",
            0,
          ],
        },
      },
      pending: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "pending"],
            },
            "$amount",
            0,
          ],
        },
      },
      total_count:{$sum:1}
    },
  };
  var match = {
    $match: {},
  };
  pipe.push({
    $match: {},
  });
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? parseInt(req.query.limit) : 20;
  var skip = (parseInt(page) - 1) * parseInt(limit);
  var sort = { _id: 1 };
  if (req.query.sort && req.query.order) 
  {
    var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
    sort = JSON.parse(temp);
  }
  var filter = { content: { $ne: null } };
  pipe.push(group);
  pipe.push(lookup);
  pipe.push(project);
  Withdraw.aggregate(pipe)
    .skip(skip)
    .sort(sort)
    .limit(limit)
    .then((data) => {
      return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    })
    .catch((errors) => {
      console.log(errors.message);
      return ReponseHelper.response(
        res,
        200,
        HashDataHelper.makeError(
          "failed",
          errors.message,
          [],
          "FAILED_GET_DATA"
        )
      );
    });
};

exports.getDetail =(req,res)=>{
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? parseInt(req.query.limit) : 20;
    var skip = (parseInt(page) - 1) * parseInt(limit);
    var sort = { updatedAt: 1 };
    if (req.query.sort && req.query.order) 
    {
        var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
        sort = JSON.parse(temp);
    }
    Withdraw.find({userId:req.params.id,status:"approved"},{'amount':1,'updatedAt':1}).sort(sort).limit(limit).skip(skip).then((data)=>{
        ReponseHelper.response(res,200,HashDataHelper.make(data));

    }).catch((err)=>{
        ReponseHelper.response(res,422,HashDataHelper.makeError(422,err.message,[],'ERRORS_GET_DATA'));
    })
}