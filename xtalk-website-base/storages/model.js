'use strict';
import _ from 'lodash';

//store model socket
var models = [];
var modelSockets = {};
//TODO - should store to redis??
exports = module.exports = {
  get: function(socket){
    return _.map(models, function(item){
      return item.user;
    });

  },

  add: function(socket) {
    models.push(socket);
  },

  //remove socket by id
  remove: function(socket) {
    _.remove(models, function(model) {
      // console.log('model',model);
      return model.id === socket.id;
    });
  },

  /**
  * emit event to model id
  */
  emitTo: function(modelId, event, data) {
    models.forEach(function(socket) {
      if (socket.user && socket.user.id === modelId) {
        socket.emit(event, data);
      }
    });
  },

  addModel(socket) {
    if (!socket.user) { return; }
    var roomName = 'model_' + socket.user.id;
    if (!modelSockets[roomName]) {
      modelSockets[roomName] = [socket];
    } else {
      modelSockets[roomName].push(socket);
    }
  },

  disconnectOtherModelSockets(socket) {
    if (!socket.user) { return; }
    var roomName = 'model_' + socket.user.id;

    if (!modelSockets[roomName]) {
      modelSockets[roomName] = [socket];
    } else {
      modelSockets[roomName].forEach(function(socket) {
        socket.emit('another-model-connected');
        socket.disconnect();
      });

      modelSockets[roomName] = [socket];
    }
  },

  removeModelSocket(socket) {
    if (!socket.user) { return; }
    var roomName = 'model_' + socket.user.id;

    if (modelSockets[roomName]) {
      _.remove(modelSockets[roomName], function(s) {
        return s.id === socket.id;
      });
    }
  }
};