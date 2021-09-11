var express = require("express");
var router = express.Router();
var twilio = require("twilio");
var VoiceResponse = twilio.twiml.VoiceResponse;
var auth = require("../../auth.service");
var controller= require('./index.controller');

// POST /calls/connect

router.post(
  "/connect",
  twilio.webhook({
    validate: false,
  }),
  function (req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var callerId = process.env.TWILIO_PHONE_NUMBER;
    var twiml = new VoiceResponse();
    var dial = twiml.dial({
      callerId: callerId,
    });
    if (phoneNumber != null) {
      dial.number(phoneNumber);
    } else {
      dial.client("support_agent");
    }

    res.send(twiml.toString());
  }
);

// GET /token/generate
router.post("/token/generate", auth.isAuthenticated(), controller.generateToken);

router.post("/mask", controller.maskNumber);



router.post("/handleDialCallStatus/:callHistoryId",controller.saveHistory)

//Call recoring event
router.post("/recording-events/:from/:to",controller.recordingEvent);

// get call history of member
router.get("/history", auth.isAuthenticated(),controller.getUserCallHistory );

// get call history of model
router.get("/model/history", auth.isAuthenticated(), controller.getModelCall);

router.get('/info',auth.isAuthenticated(),controller.getCallInfo);
module.exports = router; 
