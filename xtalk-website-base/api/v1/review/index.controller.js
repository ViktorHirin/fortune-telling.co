'use strict'
var _ = require('lodash');
var ReviewValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var UserModel = require('../../../models/user.model');
var CallHistory = require('../../../models/callhistory.model');
var ReviewModel = require('../../../models/review.model');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var async = require('async');
exports.createReview = (req, res) => {
    async.waterfall([
        (done) => {
            ReviewValidator.validateCreate(req, function(err, data) {
                if (err) {
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({
                        status: 422,
                        error: err
                    }));
                    done('errors');
                }
                done(err, data);
            });
        },
        (data, done) => {
            CallHistory.find({
                userId: req.user._id,
                to: data.userId
            }, (errCall, callDocs) => {
                console.log("log call docs");
                console.log(callDocs);
                if (errCall || callDocs.length == 0) {
                    return ReponseHelper.response(res, 200, HashDataHelper.makeError({
                        status: 'failed',
                        msg: "Please call the model to rate the model"
                    }));
                }
                done(errCall, data)
            });
        },
        (data, done) => {
            var newReview = new ReviewModel(data);
            var now = new Date();
            let reviewerId = req.user._id;
            newReview.reviewerId = reviewerId;
            newReview.updateAt = newReview.createdAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
            newReview.save(function(err, review) {
                if (err) {
                    console.log('err', err);
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({
                        status: 'failed',
                        error: err
                    }));
                }
                //var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
                var data = review.toObject();
                updateRatingUser(req, res);
                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
            });
        }
    ], (err) => {
        console.log(err);
        return errors;
    });
}

exports.getReview = (req, res) => {
        var page = req.query.page ? req.query.page : 1;
        var limit = (req.query.limit) ? req.query.limit : 20;
        var skip = (parseInt(page) - 1) * parseInt(limit);
        var sort = {
            "_id": 1
        };
        if (req.query.sort && req.query.order) {
            var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
            console.log(temp);
            sort = JSON.parse(temp);
        }
        var filter = {
            content: {
                $ne: null
            }
        };
        var condition = {
            isDeleted: "false",
            content: {
                $ne: null
            },
            userId: req.params.id
        };
        var match = {
            $match: condition
        }
        var userId = null;
        if (req.user) {
            userId = req.user._id;

        }
        var pipe = [match];
        pipe.push({
            "$limit": parseInt(limit)
        });
        pipe.push({
            $skip: skip
        });
        pipe.push({
            "$sort": sort
        });
        var query = ReviewModel.find(condition).limit(parseInt(limit)).skip(skip).sort().populate('userId', 'firstName lastName  _id ').populate('reviewerId', 'firstName lastName  _id createdAt');
        query.exec(function(err, result) {
            return ReponseHelper.response(res, 200, HashDataHelper.make(result));
        }).catch(function(err) {
            console.log(err);
            return ReponseHelper.response(res, 500, HashDataHelper.makeError({
                error: err,
                'msg': 'Server Error'
            }));
        });

    }
    // exports.getReview
    // exports.updateReview
exports.getAllReview = (req, res) => {
    var page = req.query.page ? req.query.page : 1;
    var limit = (req.query.limit) ? req.query.limit : 30;
    var skip = (parseInt(page) - 1) * parseInt(limit);
    var sort = {
        "_id": 1
    };
    if (req.query.sort && req.query.order) {
        var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
        sort = JSON.parse(temp);
    }
    var filter = {
        content: {
            $ne: null
        }
    };
    var condition = {
        isDeleted: false,
        content: {
            $ne: null
        }
    };
    var match = {
        $match: condition
    }
    var userId = null;
    if (req.user) {
        userId = req.user._id;

    }
    var total = {
        '_id': null,
        'total': {
            '$sum': 1
        }
    };

    var pipe = [match];
    pipe.push({
        "$group": total
    })
    ReviewModel.aggregate(pipe).then((toatalDocs) => {
        var query = ReviewModel.find(condition).limit(parseInt(limit)).skip(skip).sort(sort).populate('userId', 'firstName lastName  _id ').populate('reviewerId', 'firstName lastName  _id createdAt');
        query.exec(function(err, result) {
            if (err) {
                return ReponseHelper.response(res, 500, HashDataHelper.makeError({
                    error: err,
                    'msg': 'Server Error'
                }));
            }
            return ReponseHelper.response(res, 200, {
                data: result,
                total_count: toatalDocs[0].total
            });
        })
    }).catch(function(err) {
        console.log(err);
        return ReponseHelper.response(res, 500, HashDataHelper.makeError({
            error: err,
            'msg': 'Server Error'
        }));
    });

}
exports.deleteReview = (req, res) => {
    ReviewModel.findOneAndRemove({
        _id: req.params.id
    }, (err, data) => {
        if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({
                status: 422,
                error: err
            }));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    });
}

function updateRatingUser(req, res) {
    console.log("body :" + req.user._id);
    req.user._id = req.body.userId;
    console.log("body :" + req.user._id);
    ReviewModel.aggregate([{
            $match: {
                $and: [{
                    "userId": req.user._id
                }, {
                    "content": {
                        $ne: null
                    }
                }]
            },
        }, {
            $group: {
                _id: null,
                average: {
                    $avg: "$rating",
                }
            }
        }],
        (err, result) => {
            console.log('update rating')
            console.log(result);
            console.log(err);
            if (err || result[0] == null) {

            } else {
                console.log("rating:" + result[0].average);
                UserModel.findOneAndUpdate({
                    _id: req.body.userId
                }, {
                    $set: {
                        rating: result[0].average
                    }
                }).exec((err, value) => {
                    if (err) {

                        console.log(err);
                    }
                });
            }
        });
};

exports.getRating = (req, res) => {
    req.user._id = "5f30bed61adc6a3004df6d2a";
    ReviewModel.aggregate([{
            $match: {
                $and: [{
                    "userId": req.user._id
                }, {
                    "content": {
                        $ne: null
                    }
                }]
            },
        }, {
            $group: {
                _id: "$userId",
                average: {
                    $avg: "$rating",
                }
            }
        }],
        (err, result) => {
            console.log('update rating')
            console.log(result);
            console.log(err);
            //  UserModel.findOneAndUpdate({id:req.user._id},{$set:{rating:result}}).then((value)=>{
            //  console.log(value);}                   
            //      );
        });
}

exports.postCallRating = (req, res) => {
    var query = {
        _id: req.body.id,
        userId: req.user._id,
    }
    var newValue = {
        $set: {
            rating: req.body.rating,
        }
    }

    CallHistory.findOneAndUpdate(query, newValue, (err, data) => {
        if (err) {
            console.log(err);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({
                status: 422,
                error: err
            }));
        }
        return ReponseHelper.response(res, 200, HashDataHelper.make(data));
    })
}