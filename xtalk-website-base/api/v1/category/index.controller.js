var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var CategoryModel = require('../../../models/category.model');



exports.index = function (req, res) {
 
  CategoryModel.find().exec(function (err,result) {
    return ReponseHelper.response(res, 200, HashDataHelper.make(result));
  }).catch(function (err) {

    return ReponseHelper.response(res, 500, HashDataHelper.makeError({error: err, 'msg': 'Server Error'}));
  });
}

