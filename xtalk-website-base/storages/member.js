'use strict';
import _ from 'lodash';
import redisClient from '../components/Redis';

//store sockets of subcriber in model room
/**
* {
  roomId: [socket]
}
*/
var members = {};
var models = {};
//TODO - should store to redis??
exports = module.exports = {
  get: function(roomId){
    if (!members[roomId]) {
      return [];
    }

    return members[roomId];
  },
  add: function(roomId, data) {

    if (!members[roomId]) {
      members[roomId] = [];
    }

    members[roomId].push(data);
  },

  //remove socket by id
  remove: function(user) {
    if (!user) { return; }
    for(let o in members) {
      _.remove(members[o], function(client) {
        return client.id === user.id;
      });
    }
  },

  /**
  * emit event to model id
  */
  emitToRoom: function(roomId, event, data) {
    _.each(members[roomId], function(socket) {
      socket.emit(event, data);
    });
  }
};