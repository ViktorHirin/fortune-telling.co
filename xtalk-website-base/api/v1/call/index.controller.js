var _ = require('lodash');
var twilio = require("twilio");
var VoiceResponse = twilio.twiml.VoiceResponse;
var ClientCapability = require("twilio").jwt.ClientCapability;
var UserModel = require("../../../models/user.model");
var CallHistory = require("../../../models/callhistory.model");
var config = require("../../../config/config");
const {result} = require('lodash');
var ReponseHelper = require('../../../helpers/ReponseHelper');
var HashDataHelper = require('../../../helpers/HashDataHelper');
var async = require("async");
var logger = require("../../../config/lib/logger");
exports.generateToken = function (req, res) {
  const applicationSid = config.twiMlAppSid;
  const accountSid = config.twiAccountSid;
  const authToken = config.twiAuthToken;

  console.log(accountSid + ' ' + authToken + ' ' + applicationSid);
  const client = require("twilio")(accountSid, authToken);
  const expiresIn = 60 * 60 * 24 * 7;
  var clientName = req.user.firstName +'+'+  req.user.lastName;
  clientName=clientName.split(' ').join('-');
  var capability = new ClientCapability(
      {
        accountSid: accountSid,
        authToken: authToken,
        expiresIn
      }
  );

  capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: applicationSid,
      })
      );
  capability.addScope(
      new ClientCapability.IncomingClientScope(clientName.trim().toLowerCase())
      );
  var token = capability.toJwt();
  logger.info("log client name");
  logger.info(clientName.toLowerCase());
  res.setHeader("Content-Type", "application/json");
  res.send(
      JSON.stringify({
        token: token,
      })
      );
}

exports.maskNumber = function (req, res) {
  const VoiceResponse = require("twilio").twiml.VoiceResponse;
  const response = new VoiceResponse();
  if (req.body.To != req.body.From)
  {
    res.header("Content-Type", "text/xml");
    async.waterfall(
        [
          (done) =>
          {
            UserModel.findOne(
                {
                  _id: req.body.To,
                  isActive: true,
                },
                (err, data) => {
              if (data == null || err) {
                response.say("Sorry, model not found. Goodbye ");
                return res.send(response.toString());
                done("Sorry, model not found. Goodbye ");

              }
              let countToken = 0;
              UserModel.findByIdAndUpdate(req.body.To, {$set: {}}).then((saveCalling) => {
                done(null, data);
              }).catch((errSaveCalling) => {
                done(errSaveCalling.message);
              })

            });
          },
          (data, done) =>
          {
            UserModel.findOne(
                {
                  _id: req.body.From,
                },
                (errFrom, dataFrom) => {
              if (dataFrom == null || errFrom)
              {
                response.say("Goodbye");
                return res.send(response.toString());
              } else
              {
                countToken = parseInt(dataFrom.token);
                if (dataFrom.token <= 0)
                {
                  response.say("Your balance is not enough To make call please increase your balance ");
                  return res.send(response.toString());
                }
                if (!data.doNotDisturb)
                {
                  if (data.status == false)
                  {
                    let callHistory = new CallHistory({
                      to: req.body.To,
                      userId: req.body.From,
                      callsId: req.body.CallSid,
                    });
                    callHistory.save((err, callData) => {
                      const dial = response.dial({
                        // add action to remote calling and calculator token when calling finish
                        action:
                            config.backendUrl + "/api/v1/call/handleDialCallStatus/" +
                            callData.id,
                        method: "POST",
                        // DialCallStatus:'completed',
                        record: "record-from-answer-dual",
                        callerId: config.callerPhoneNumber,
                        timeLimit: Math.floor((countToken / req.pageconfig.price) * 60),
                        recordingStatusCallbackEvent: "completed",
                        recordingStatusCallback:
                            config.backendUrl + "/api/v1/call/recording-events/" +
                            req.body.From +
                            "/" +
                            req.body.To +
                            "?callId=" +
                            callData.id,
                      });
                      if (data.phone.e164Number)
                      {
                        dial.number(data.phone.e164Number);
                      } else
                      {
                        dial.number(data.phone);
                      }
                      response.dial = dial;
                      logger.info("SDT:" + data.phone);
                      logger.info(response.toString());
                      return res.send(response.toString());
                    });
                  } else
                  {
                    //when client online and donotDisturb = false
                    var clientName = data.firstName +'+'+  data.lastName;
                    clientName=clientName.split(' ').join('-');

                    let callHistory = new CallHistory({
                      to: req.body.To,
                      userId: req.body.From,
                      callsId: req.body.CallSid,
                    });
                    callHistory.save((err, callData) => {
                      const dial = response.dial({
                        // add action to remote calling and calculator token when calling finish
                        action:
                            config.backendUrl + "/api/v1/call/handleDialCallStatus/" +
                            callData.id,
                        method: "POST",
                        // DialCallStatus:'completed',
                        record: "record-from-answer-dual",
                        callerId: config.callerPhoneNumber,
                        timeLimit: Math.floor((countToken / req.pageconfig.price) * 60),
                        recordingStatusCallbackEvent: "completed",
                        recordingStatusCallback:
                            config.backendUrl + "/api/v1/call/recording-events/" +
                            req.body.From +
                            "/" +
                            req.body.To +
                            "?callId=" +
                            callData.id,
                      });
                      const clientParameter = dial.client(
                          {},
                          clientName.toLowerCase()
                          );
                      // add parameter list to connection
                      clientParameter.parameter({
                        name: "callId",
                        value: callData._id,
                      });
                      clientParameter.parameter({
                        name: "from",
                        value: dataFrom._id,
                      });
                      clientParameter.parameter({
                        name: "fromName",
                        value: dataFrom.firstName + ' ' + dataFrom.lastName,
                      });
                      clientParameter.parameter({
                        name: 'availMin',
                        value: Math.floor((countToken / req.pageconfig.price))
                      })
                      dial.client = clientParameter;
                      response.say("Goodbye");
                      response.dial = dial;
                      logger.info("SDT:" + data.phone);
                      logger.info(response.toString());
                      return res.send(response.toString());
                    });
                  }
                  // data.isCalling=true;
                  data.save((errSave, saveData) => {
                    if (errSave)
                    {
                      console.log(errSave.message);
                    }

                  })
                } else
                {
                  // donotDisturb = true , not make call
                  response.say("Sorry,please call back later");
                  logger.info(response.toString());
                  return res.send(response.toString());
                }
              }
            }
            )
          }
        ], (errors) =>
    {
      logger.info(errors);
      return;
    });

  } else
  {
    //You cannot make outgoing calls  to yourself
    response.say("You cannot make outgoing calls  to yourself");
    logger.info(response.toString());
    return res.send(response.toString());
  }



}

exports.saveHistory = function (req, res) {
  const input = req.body;
  const response = new VoiceResponse();
  res.header("Content-Type", "text/xml");
  async.waterfall([
    (done) =>
    {
      CallHistory.findById(req.params.callHistoryId).exec((errors, callHistoryDocs) => {
        if (errors)
        {

          res.send(`<Status>404</Status>
          <Message>Call History  was not found</Message>`);
        }
        done(errors, callHistoryDocs);

      });
    },
    (callHistory, done) =>
    {
      if (input.DialCallDuration == null || input.DialCallStatus != 'completed')
      {
        var newValue = {
          $set: {
            callStatus: input.DialCallStatus,
          }
        }
        CallHistory.findByIdAndUpdate(req.params.callHistoryId, newValue, (errors, result) => {
          if (errors)
          {
            res.send(`<Status>404</Status>
              <Message>Errors when update call history</Message>`);
          }
        })
        response.say('model is busy ,please call later');
        res.send(response.toString());
        done('errors')
      } else
      {
        const token = Math.floor((Math.floor(input.DialCallDuration / 60) + 1) * req.pageconfig.price);
        console.log('token spent +' + token);

        var newValue = {
          $set: {
            callStatus: input.DialCallStatus,
            recordingUrl: input.RecordingUrl,
            callDuration: input.DialCallDuration,
            token: token
          }
        }
        CallHistory.findByIdAndUpdate(req.params.callHistoryId, newValue, (errors, result) => {
          if (errors)
          {
            console.log(errors);
            res.send(`<Status>404</Status>
              <Message>Errors when update call history</Message>`);
          } else
          {
            console.log('from :' + callHistory.userId + 'to :' + callHistory.to)
            done(null, callHistory.userId, callHistory.to, token);
          }
        })
      }
    },
    (from, to, token, done) =>
    {
      UserModel.findById(from, (errors, userDocs) => {
        if (errors)
        {
          res.send(`<Status>404</Status>
          <Message>Can not find user</Message>`);
        }
        let myQuery = {_id: from};
        let myValue = {$set: {token: userDocs.token - token}};
        UserModel.findOneAndUpdate(myQuery, myValue, (errorsUser, result) => {
          if (errorsUser) {
            res.send(`<Status>404</Status>
          <Message>Can not update user</Message>`);
          }
          done(errorsUser, to, token);
        })
      })
    },
    (to, token, done) =>
    {
      UserModel.findById(to, (errors, modelDocs) => {
        if (errors)
        {
          res.send(`<Status>404</Status>
          <Message>Can not find model</Message>`);
          done('errors');
        } else
        {
          let myQuery = {_id: modelDocs._id};
          let myValue = {$set: {token: modelDocs.token + token}};
          UserModel.findOneAndUpdate(myQuery, myValue, (errorsModel, result) => {
            if (errorsModel) {
              res.send(`<Status>404</Status>
            <Message>Can not update model</Message>`);
            }
            response.say('Thank you for using our services.Goodbye');
            res.send(response.toString());
            done(errors, 'done');
          })
        }
      })
    }
  ],
      (ce) => {
    CallHistory.findById(req.params.callHistoryId, (errors, result) => {
      UserModel.findByIdAndUpdate(result.to, {$set: {}}).then((data) => {
        return ce;
      }).catch((err) => {
        return ce;
      })
    })

  }
  );

}

exports.recordingEvent = function (req, res) {
  let isFree = false;
  UserModel.findById(req.params.to, (error, model) => {
    if (error) {
      return ReponseHelper.response(
          res,
          422,
          HashDataHelper.makeError({status: 422, error: error})
          );
    }
    /**
     * Save history call
     */
    if (req.body.RecordingStatus == "completed") {
      UserModel.findOne({_id: req.params.from}, (error, docs) => {
        if (error) {
          return ReponseHelper.response(
              res,
              422,
              HashDataHelper.makeError({
                status: 422,
                error:
                    "Err when create call history " +
                    req.body.CallSid +
                    " " +
                    req.body.RecordingUrl +
                    " id:" +
                    RecordingSid,
              })
              );
        }
//        let token = docs.token - (Math.floor(req.body.RecordingDuration / 60) + 1) * req.pageconfig.price;
//        let setData = {
//          $set: {
//            to: req.params.to,
//            userId: req.params.from,
//            recordingUrl: req.body.RecordingUrl,
//            callDuration: req.body.RecordingDuration,
//            //token: token,
//          },
//        };
        return res.send(
            "<Response><Dial callerId='" + config.callerPhoneNumber + "'></Dial></Response>"
            );
        //   CallHistory.update({_id:req.query.callId}, setData).then(
        //     (error, callData) => {
        //       if (error != null) {
        //         logger.info("err update recording call");
        //         logger.info(error);
        //         console.log(error);
        //         // model.token = model.token + token;
        //         // model.save();
        //         return ReponseHelper.response(
        //           res,
        //           422,
        //           HashDataHelper.makeError({ status: 422, error: error })
        //         );
        //       }
        //       //  return ReponseHelper.response(res, 200, HashDataHelper.make({status: 200, message:'ok'}));

        //     }
        //   );
      });
    }
  });
}

exports.getUserCallHistory = function (req, res) {
  const sort = {createdAt: 1};
  CallHistory.find({userId: req.user._id, callDuration: {$gt: 0}})
      .lean()
      .populate("userId", "token")
      .sort(sort)
      .populate("to", "avatar firstName lastName rating languages age id")
      .exec((error, callHistory) =>
      {
        if (error) {
          return ReponseHelper.response(
              res,
              422,
              HashDataHelper.makeError({status: 422, error: error})
              );
        }
        var freeToken = 0 ;
        if(req.user.freeToken){
          freeToken =  req.user.freeToken;
        }
        var token = req.user.token + freeToken;
        var result = {};
        result.listCall = callHistory.map((historyItem) => {
          if (historyItem.to != null && historyItem.to["avatar"] != null) {
            historyItem.avartarUrl = historyItem.to.avatar["fileUrlBase"];
          }
          return historyItem;
        });
        result.token = token;
        return ReponseHelper.response(res, 200, HashDataHelper.make(result));
      });
}

exports.getModelCall = function (req, res) {
  const sort = {createdAt: 1};
  CallHistory.find({to: req.user._id})
      .lean()
      .populate("to", "token")
      .sort(sort)
      .populate(
          "userId",
          "avatar.fileUrlBase firstName lastName rating languages age id"
          )
      .exec((error, callHistory) => {
        if (error) {
          return ReponseHelper.response(
              res,
              422,
              HashDataHelper.makeError({status: 422, error: error})
              );
        }
        var result = {};
        var token = req.user.token || 0;
        result.listCall = callHistory.map((historyItem) => {
          if (
              historyItem.userId != null &&
              historyItem.userId["avatar"] != null
              ) {
            historyItem.avartarUrl = historyItem.userId.avatar["fileUrlBase"];

          }
          return historyItem;
        });
        result.token = token;
        return ReponseHelper.response(res, 200, HashDataHelper.make(result));
      });
}

exports.getCallInfo = function (req, res) {
  var condition = {
    'callsId': req.query.callId,
  }
  if (req.query.from)
  {
    condition.userId = req.user._id.toString();

  }
  if (req.query.to)
  {
    condition.to = req.query.to;
  }
  console.log('log condition');
  console.log(condition);
  var query = CallHistory.findOne(condition);
  query.exec((err, callHistory) => {
    if (err) {
      return ReponseHelper.response(res, 200, HashDataHelper.make([]));
    }
    return ReponseHelper.response(res, 200, HashDataHelper.make(callHistory));
  }).catch((err) => {
    return ReponseHelper.response(res, 500, HashDataHelper.makeError({error: err, 'msg': 'Server Error'}));
  })


}
