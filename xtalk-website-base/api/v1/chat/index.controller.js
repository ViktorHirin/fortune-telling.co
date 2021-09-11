var _ = require('lodash');
//var UserValidator = require('./validators.js');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var UserModel = require('../../../models/user.model');
var Conversation =require('../../../models/conversation.model');
var Chat = require('../../../models/chatmessage');
var ObjectId = require('mongoose').Types.ObjectId; 
exports.allRoom = function (req, res) {
    UserModel.findById(req.user._id,(err,result)=>{
        if (err) {
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
          } 
        if(result.role == 'member'){
            Conversation.find({userId: new ObjectId(req.user._id)}).populate('modelId','avatar.fileUrlBase firstName lastName status').exec( (err,result)=>{
                if(err)
                {
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                }
                else
                {
                    // var res;
                    // result.forEach(element => {
                    //     Chat.find({conversationId:element._id,readFlag:false},(err,chatDoc)=>{
                    //         element.push('message',chatDoc);
                    //         Object.assign(res,element);
                    //     })

                        
                    // });
                    return ReponseHelper.response(res, 200, HashDataHelper.make(result));       
                }
            });
        }
        else{
            Conversation.find({modelId: new ObjectId(req.user._id)}).populate('userId','avatar.fileUrlBase firstName lastName status').exec( (err,result)=>{
                if(err)
                {
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                }
                else
                {
                    return ReponseHelper.response(res, 200, HashDataHelper.make(result));         
                }
            });
        }
    })
    

}
exports.getRoomInfo=function(req,res){
    console.log('request :'+req.params.id+'user :'+req.user._id) ;
    // Conversation.findOne({$and:[
    //                         {$or:[{_id:req.params.id,userId:req.user._id}]},
    //                         {$or:[{_id:req.params.id,modelId:req.user._id}]}
    //                     ]})
    Conversation.findOne({_id:req.params.id})
                            .populate('modelId','firstName lastName avatar.fileUrlBase status ')
                            .populate('userId','firstName lastName avatar.fileUrlBase status ')
                            .exec((err,conversation)=>{
                                    if(err){
                                        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
                                    }
                                    if(conversation==null){
                                        return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: 'Room not found'}));
                                    }
                                    return ReponseHelper.response(res, 200, HashDataHelper.make(conversation));  
        

    })
}

exports.getMessage=function(req,res){
    var length=req.query.length || 30;
    var skip=req.query.skip || 0;
    var match={
       $match:{
//             isDeleted:false,
            roomId:req.params.id
        }
    };
    var total={'_id' :null, 'total' :{ '$sum': 1 }};
    var pipe =[];
    pipe.push(match);
    pipe.push({"$group":total}); 
    length=parseInt(length);
    skip=parseInt(skip);
    console.log('skip :'+skip+' length :'+length);
    Chat.aggregate(pipe).then((totalDoces)=>{
        
         Chat.find({roomId:req.params.id})
        .populate('to','firstName lastName avatar.fileUrlBase status ')
        .populate('from','firstName lastName avatar.fileUrlBase status ')
        .sort({createdAt :-1})
        .skip(skip)
        .limit(length)
        .then((conversation)=>{
                if(conversation==null){
                    return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: 'Room not found'}));
                }
               if(totalDoces)
               {
                return ReponseHelper.response(res, 200,{data:conversation,total:totalDoces[0].total});  
               }
               else
               {
                return ReponseHelper.response(res, 200,{data:conversation,total:0});  
               }


        })
        .catch((err)=>{
            console.log(err);
            return ReponseHelper.response(res, 422, HashDataHelper.makeError({status: 422, error: err}));
        })
    });
   

}