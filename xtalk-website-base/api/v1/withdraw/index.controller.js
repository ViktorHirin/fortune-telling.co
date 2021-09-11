var _ = require('lodash');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var UserModel = require('../../../models/user.model');
var WithDrawModel = require('../../../models/withdraw.model');
var Commission = require('../../../models/commission.model');
var Options = require('../../../models/options.model');
exports.getAll= (req,res)=>{
     var page = req.query.page ? req.query.page : 1;
    var limit = (req.query.limit) ?parseInt(req.query.limit) : 20;
    var skip = (parseInt(page) - 1) * parseInt(limit);
    var sort =  {"_id": 1};
        if (req.query.sort && req.query.order) {
        var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
        console.log(temp);
            sort = JSON.parse(temp);
        }
    var filter = {content:{$ne:null}};
    var condition = {isDeleted:false,userId:req.user._id};
    var match =  {
        $match: condition
    }
    var userId = null;
    if(req.user){
        userId = req.user._id;
        
    }
    var total={'_id' :null, 'total' :{ '$sum': 1 }};
    var pipe =[match];
    // pipe.push({"$limit": parseInt(limit)});
    // pipe.push({$skip: skip});
    // pipe.push({"$sort": sort});
    pipe.push({"$group":total});
    WithDrawModel.aggregate(pipe).then((totalDocs)=>{
        WithDrawModel.find({userId:req.user._id,isDeleted:false}).sort(sort).skip(skip).limit(limit).populate('userId','firstName lastName email').then((withdrawDocs)=>{
            if(totalDocs.length)
            {
                return ReponseHelper.response(res, 200, HashDataHelper.make({withdraws:withdrawDocs,total_count:totalDocs[0].total}));
            }
            else
            {
                return ReponseHelper.response(res, 200, HashDataHelper.make({withdraws:withdrawDocs,total_count:0}));
            }

        }).catch((err)=>{
            console.log(err);
        });
    });
}
exports.dashboardAll=(req,res)=>{
    var page = req.query.page ? req.query.page : 1;
    var limit = (req.query.limit) ?parseInt(req.query.limit) : 20;
    var skip = (parseInt(page) - 1) * parseInt(limit);
    var sort =  {"_id": 1};
        if (req.query.sort && req.query.order) {
        var temp = '{"' + req.query.sort + '":"' + req.query.order + '"}';
        console.log(temp);
            sort = JSON.parse(temp);
        }
    var filter = {content:{$ne:null}};
    var condition = {isDeleted:false};
    var match =  {
        $match: condition
    }
    var userId = null;
    if(req.user){
        userId = req.user._id;
        
    }
    var total={'_id' :null, 'total' :{ '$sum': 1 }};
    var pipe =[match];
    // pipe.push({"$limit": parseInt(limit)});
    // pipe.push({$skip: skip});
    // pipe.push({"$sort": sort});
    pipe.push({"$group":total});
    
    WithDrawModel.aggregate(pipe).then((totalDocs)=>{
        WithDrawModel.find({isDeleted:false}).sort(sort).skip(skip).limit(limit).populate('userId','firstName lastName email').then((withdrawDocs)=>{
             return ReponseHelper.response(res, 200, {data:withdrawDocs,total_count:totalDocs[0].total});
        }).catch((errors)=>{
            console.log(errors);
        })

    }).catch((err)=>{
        console.log(err);
    });
}

exports.totalWithDraw=(req,res)=>{
    WithDrawModel.aggregate([{
        $match:{
            $and:[{userId:req.user._id}]
        }
    },{
        $group:{
            _id:null,
            totalWithdraw:{
                $sum : "$amount"
            }
        }
    }],(err,result)=>{
        console.log(result);
        res.send(result);
    });
}

exports.getBlance = (req, res) => {
    UserModel.findById(req.user._id, (err, userRes) => {
        if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({ status: 'errors', msg: 'Failed get blance' }));
        }
        let balnce = userRes.token;

        Options.find({ option_name: { $in: ['rate_money','commission'] } }).then((options) => {
            let rate = 0;
            let commission = 0;
            options.forEach((optionItem, index) => {
                if (optionItem.option_name == 'rate_money') {
                    rate = optionItem.option_value;
                }
                if (optionItem.option_name == 'commission') {
                    commission = optionItem.option_value;
                    balnce = balnce - (balnce * commission) / 100;
                }
                if (index == options.length - 1) {
                    return ReponseHelper.response(res, 200, HashDataHelper.make({
                        blance: balnce,
                        rate: parseFloat(rate),
                        commission: commission
                    }));
                }
            })
        })

    })

        }

function arrayColumn(array, columnName) {
    return array.map(function(value,index) {
        return value[columnName];
    })
}
exports.addNew = async (req, res) => {

  let balance = req.user.token;
  try {
    let rateDocs = await Options.findOne({option_name: 'rate_money'});
    let rateMoney = rateDocs.option_value
    let commissionDocs = await Options.findOne({option_name: 'commission'});
    let commission = commissionDocs.option_value;

    balance = balance - (balance * commission) / 100;
    let moenyBlance = balance / rateMoney;

    if (req.body.amount > moenyBlance) {
      return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: 'Failed'}));
    }
    let token = req.body.amount * rateMoney;
    var newWithDraw = new WithDrawModel({
      userId: req.user._id,
      amount: req.body.amount,
      token: token,
      rate: rateMoney,
      status: 'pending'
    })
    let result = await newWithDraw.save();
    return ReponseHelper.response(res, 200, HashDataHelper.make(result));
  } catch (e) {
    return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, msg: "can't not create withdraws request"}));
  }




}

exports.approved=(req,res)=>{
    console.log(req.body.id);
    if(req.body.id){
        var myquery = { _id: {$in:req.body.id }};  
            var newvalues = { $set: {
              status:'approved',
            } };  

            WithDrawModel.updateMany({'_id':{$in:req.body.id},'status':'pending'}, newvalues, function(err, data) {  
                if (err){
                  var errMsg={
                    message:"Error when update withdraws",
                    type:'error'
                  }
                  console.log(err); 
                  return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                }  
                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                
            });  
       }
}
exports.reject=(req,res)=>{
    console.log(req.body);
    if(req.body.id){
        var myquery = { _id: req.body.id };  
            var newvalues = { $set: {
              status:'reject',
            } };  

            WithDrawModel.updateMany({'_id':{$in:req.body.id},'status':'pending'}, newvalues, function(err, data) {  
                if (err){
                  var errMsg={
                    message:"Error when update withdraws",
                    type:'error'
                  }
                  console.log(err); 
                  return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                }  
                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                
            });  
       }
}

exports.delete=(req,res)=>{
    console.log(req.body);
    if(req.body.id){
        var myquery = { _id: req.body.id };  
            var newvalues = { $set: {
              isDeleted:true,
            } };  

            WithDrawModel.updateMany({'_id':{$in:req.body.id}}, newvalues, function(err, data) {  
                if (err){
                  var errMsg={
                    message:"Error when update withdraws",
                    type:'error'
                  }
                  console.log(err); 
                  return ReponseHelper.response(res, 422, HashDataHelper.makeError(errMsg));
                }  
                return ReponseHelper.response(res, 200, HashDataHelper.make(data));
                
            });  
       }
}

