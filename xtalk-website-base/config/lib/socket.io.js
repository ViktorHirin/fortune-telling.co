"use strict";
// Load the module dependencies
var config = require("../config"),
  path = require("path"),
   _ = require('lodash'),
  fs = require("fs"),
  http = require("http"),
  https = require("https"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  socketio = require("socket.io"),
  session = require("express-session"),
  MongoStore = require("connect-mongo")(session);
var jwt = require("jsonwebtoken");
var UserModel = require("../../models/user.model");
var Conversation = require("../../models/conversation.model");
const TrustedComms = require("twilio/lib/rest/preview/TrustedComms");
var ChatMessage = require("../../models/chatmessage");
// Define the Socket.io configuration method
module.exports = function (app, db) {
  var server;
  if (config.secure && config.secure.ssl === true) {
    // Load SSL key and certificate
    var privateKey = fs.readFileSync(
      path.resolve(config.secure.privateKey),
      "utf8"
    );
    var certificate = fs.readFileSync(
      path.resolve(config.secure.certificate),
      "utf8"
    );
    var caBundle;

    try {
      caBundle = fs.readFileSync(path.resolve(config.secure.caBundle), "utf8");
    } catch (err) {
      console.log("Warning: couldn't find or read caBundle file");
    }

    var options = {
      key: privateKey,
      cert: certificate,
      ca: caBundle,
      //  requestCert : true,
      //  rejectUnauthorized : true,
      secureProtocol: "TLSv1_method",
      ciphers: [
        "ECDHE-RSA-AES128-GCM-SHA256",
        "ECDHE-ECDSA-AES128-GCM-SHA256",
        "ECDHE-RSA-AES256-GCM-SHA384",
        "ECDHE-ECDSA-AES256-GCM-SHA384",
        "DHE-RSA-AES128-GCM-SHA256",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES128-SHA256",
        "ECDHE-RSA-AES256-SHA384",
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "DHE-RSA-AES256-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA",
      ].join(":"),
      honorCipherOrder: true,
    };

    // Create new HTTPS Server
    server = https.createServer(options, app);
  } else {
    // Create a new HTTP server
    server = http.createServer(app);
  }
  // Create a new Socket.io server
  var io = socketio.listen(server);

  // Add an event listener to the 'connection' event
  io.on("connection", function (socket) {
    socket.address =
      socket.request.connection.remoteAddress +
      ":" +
      socket.request.connection.remotePort;
    if (socket.handshake.query.token) {
      //decode token
      try {
        var decoded = jwt.verify(
          socket.handshake.query.token,
          config.sessionSecret,
          { clockTolerance: 100 }
        );
        socket.user = decoded;
        console.log("connect user =============socket.user._id", socket.id);
        console.log("connect user =============socket.user._id",socket.user._id);
        console.log("user join", socket.user._id);
        socket.join(socket.user._id);
        activeUser(socket, io);
      } catch (e) {
        socket.user = null;
      }
    } else {
      socket.user = null;
    }

    socket.on("message:new", (data) => {
      console.log("list room join ");
      console.log(socket.rooms);
      socket.threadId = data.roomId || null;
      data.userData = socket.user || {};
      var roomId = data.roomId;
      socket.chatType = data.type;
      if (socket.user) {
        if (roomId) {
          if (data.user.role == "model") {
            Conversation.findOne({ id: roomId })
              .populate("userId")
              .then(function (room) {
                if (room) {
                  let chatMsg = new ChatMessage({
                    from: data.user.id,
                    roomId: roomId,
                    text: data.text,
                    to: getMemberInRoom(roomId, data.user.id)[0],
                  });
                  chatMsg.save((err, docs) => {
                    if (err) {
                      io.in(data.to._id).emit("message:new", {
                        type: "text",
                        message: "Err when send message, please send again",
                        from: "system",
                        time: new Date(),
                      });
                    } 
                    else {
                      if(!_.has(socket.rooms,roomId)){
                          console.log("join room ko ton tai");
                          socket.join(roomId);
                      }
                      console.log("model send message to room "+roomId);
                      io.in(room.userId._id).emit("message:new", {
                        type: "text",
                        message: data.text,
                        from: socket.user._id,
                        time: new Date(),
                        idMessage: docs._id,
                        roomId: roomId,
                      });

                    }
                  });
                }
              });
          } 
          else {
            Conversation.findOne({ id: roomId })
              .populate("modelId")
              .then(function (room) {
                if (room) {
                  let chatMsg = new ChatMessage({
                    from: data.user.id,
                    to: data.to.id,
                    userId: data.user.id,
                    roomId: roomId,
                    text: data.text,
                  });
                  chatMsg.save((err, docs) => {
                    if (err) {
                      console.log("err :", err);
                      io.in(room.userId._id).emit("message:new",{
                        type: "text",
                        message: "Err when send message, please send again",
                        from: "system",
                        time: new Date(),
                      });
                      return;
                    }
                    console.log("member send message to room "+roomId);
                    if(!_.has(socket.rooms,roomId)){
                      console.log("join room ko ton tai");
                      socket.join(roomId);
                    }
                    io.in(room.modelId._id).emit("message:new", {
                      type: "text",
                      message: docs.text,
                      from: socket.user._id,
                      time: new Date(),
                      idMessage: docs._id,
                      roomId: roomId,
                    });
                    return ;
                  });
                } 
                else {
                  createRoom(data, socket, io);
                }
              });
          }
        } else {
          // roomid = userId+modelId;
          createRoom(data, socket, io);
        }
      } else {
        console.log("ko co socket");
      }
    });
    socket.on("user:disconnect", function (data) {
      console.log("user dis connected");
      inacitveUser(socket, io);
    });
    socket.on("disconnect", function (data) {
      console.log("user dis connected");
      inacitveUser(socket, io);
      socket.removeAllListeners();
    });
    socket.on("join-room", function (data) {
      console.log("co join room " + data.from);
      var roomId = data.roomId;
      socket.chatType = data.type;

      if (socket.user && socket.user._id == data.from) {
        if (roomId) {
          Conversation.findOne({ id: roomId }).exec((err, conversationDoc) => {
            if (conversationDoc.id) {
              socket.join(roomId);
            } else {
              if (data.from && data.to) {
                createRoom(data, socket, io);
              }
            }
          });
        } else {
          io.to(`${socket.id}`).emit("notification", "You don't have room id");
        }
      }
    });

    socket.on("online", (data, fn) => {
      console.log("online event");
      activeUser(socket, io);
    });

    socket.on("join-all", (data, fn) => {
      for (var ele in data.list) {
        socket.join(data.list[ele]);
        console.log("join room " + ele);
        console.log(data.list[ele].id);
      }
    });

    socket.on("call:start", (data) => {
      console.log("data call:start event");
      let query = { _id: data.To };
      let setValue = {
        $set: {
          isCalling: true,
        },
      };
      UserModel.updateOne(query, setValue).then((result) => {
        console.log("emit call:start event");
        io.emit("call:start", data.To);
      });
    });
    socket.on("call:end", (data) => {
      console.log("data call:end event");
      let query = { _id: data.To };
      let setValue = {
        $set: {
          isCalling: false,
        },
      };
      UserModel.updateOne(query, setValue).then((result) => {
        io.emit("call:end", data.To);
      });
    });

    config.files.server.sockets.forEach(function (socketConfiguration) {
      console.log(socketConfiguration);
      require(path.resolve(socketConfiguration))(socket, io);
    });
  });
  return server;
};

function activeUser(socket, io) {
  if (socket.user) {
    UserModel.findById(socket.user._id, (err, user) => {
      if (err) {
        console.log(err);
        return;
      } else {
        if (user) {
          var myquery = { _id: user._id };
          var newvalues = { $set: { status: true } };
          UserModel.updateOne(myquery, newvalues, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
            if (user.role == "model" && user.status == false) {
              console.log("emit model:online");
              io.emit("model:online", user._id);
            }
          });
        }
      }
    });
  }
}

function inacitveUser(socket, io) {
  if (socket.user) {
    UserModel.findById(socket.user._id, (err, user) => {
      if (err) {
        console.log(err);
        return;
      } else {
        if (user) {
          var myquery = { _id: user._id };
          var newvalues = { $set: { status: false, isCalling: false } };
          UserModel.updateOne(myquery, newvalues, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
            if (user.role == "model") {
              console.log("emit user offline " + user._id);
              io.emit("model:offline", user._id);
            }
          });
        }
      }
    });
  }
}

function getMemberInRoom(roomId, member) {
  if (member) {
    var result = roomId.replace("-" + member, "");
    result = result.replace("room-", "");
    return [result];
  } else {
    var result = roomId.split("-");
    return result.shift();
  }
}

function createRoom(data, socket, io) {
  var newRoom = Conversation();
  if (data.user.role == "model") {
    newRoom.modelId = data.user.id;
    if (data.to.id) {
      newRoom.userId = data.to.id;
      newRoom.id = "room-" + data.to.id + "-" + data.user.id;
    }
  } 
  else {
    newRoom.userId = data.user.id;
    if (data.to.id) {
      newRoom.modelId = data.to.id;
      newRoom.id = "room-" + data.user.id + "-" + data.to.id;
    }
    // io.sockets.in(roomId).emit('online-members', {user:data.userData,roomId:roomId});
  }
  newRoom.owerId = data.user.id;
  newRoom.type = data.type ? data.type : "chat";
  newRoom.save((err, result) => {
    if (result) {
      socket.join(result.id);
      console.log("join new room "+result.id);
      io.sockets.in(data.to.id).emit("message:new", {
        type: "text",
        message: data.text,
        from: socket.user._id,
        time: new Date(),
        idMessage: data._id,
        roomId: newRoom.id,
      });
      sendMessageFromUser(io, socket, data, newRoom.id);
    }
  });
}

function sendMessageFromUser(io, socket, data, roomId) {
  Conversation.findOne({ id: roomId })
    .populate("userId")
    .then(function (room) {
      if (room) {
        let chatMsg = new ChatMessage({
          from: data.user.id,
          roomId: roomId,
          text: data.text,
          to: getMemberInRoom(roomId, data.user.id)[0],
        });
        chatMsg.save((err, docs) => {
          if (err) {
            io.to(roomId).emit("message:new", {
              type: "text",
              message: "Err when send message, please send again",
              from: "system",
              time: new Date(),
            });
           } 
        });
      }
    });
}
