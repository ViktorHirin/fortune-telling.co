'use strict';
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderHistorySchema = new Schema({
    userId:{type:Schema.Types.ObjectId,ref: 'User',required: true},
    logFile:{type:Schema.Types.ObjectId,ref:'File',require:true},
    topUp:{type:Schema.Types.ObjectId,ref:'TopUp',require:true},
    status:{type:Schema.Types.String,default:'success'},
    token:{type:Schema.Types.Number,default:0},
    isDeleted:{type:Schema.Types.Boolean,default:false},
    type:{type:Schema.Types.String,default:'topup'},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

OrderHistorySchema.statics={
    getTotalByUser:function getTotalToken(userId)
    {
        var condition={
            status:'success',
            userId:userId
        };
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":"$userId",
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result[0].total;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    totalTokenInYear:(userId)=>
    {
        var condition={
            status:'success',
            userId:userId
        };
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":{"$year":"$createdAt"},
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result[0].total;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    getTokenInYear:()=>
    {
        var condition={
            status:'success',
        };
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":{"$year":"$createdAt"},
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result[0].total;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    totalInMonth(month)
    {
        var yearNow=new Date().getFullYear();
        var condition={
            status:'sucess',
        }
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":{
                month:{"$month":"$createdAt"},
                year:yearNow
            },
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result[0].total;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    getTokeninMonth:function getTokeninMonth(userId,month=new Date().getMonth()){
        var yearNow=new Date().getFullYear();
        var condition={
            userId:userId,
            status:'sucess',
        }
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":{
                month:month,
                year:yearNow
            },
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    reports:function reports()
    {
        var yearNow=new Date().getFullYear();
        var condition={
            status:'sucess',
        }
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":"$userId",
            "total":{$sum: {$cond: [{$eq:["$status",'success']},1, 0]}},
            "amoutUser":{$sum:1},
            
            }
        };
        pipe.push(group);
        order.aggregate(pipe).then((result)=>
        {
            return result;
        }
        ).catch((errors)=>{
            return null;
        });
    },
    getData:()=>{
        var condition={
            status:'success',
        };
        var math={
            "$math":condition
        };
        var pipe=[];
        pipe.push(math);
        var group={"$group":{
            "_id":"$userId",
            "total":{$sum: {$cond: [{$eq:["$type",'topup']},1, 0]}},
            }
        };
        var lookup={ "$lookup": {
            "from": "user",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
       }}
        pipe.push(group);
        pipe.push(lookup);
        order.aggregate(pipe).then((result)=>
        {
            return result[0].total;
        }
        ).catch((errors)=>{
            return null;
        });
    }
};
const order=mongoose.model('Order',OrderHistorySchema);
module.exports=mongoose.model('Order',OrderHistorySchema);