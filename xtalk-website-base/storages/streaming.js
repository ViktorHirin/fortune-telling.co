'use strict';
import _ from 'lodash';

//store sockets of subcriber in model room
/**
* {
  roomId: [socket]
}
*/
var storage = {};

//TODO - should store to redis??
exports = module.exports = {
  get: function (roomId){
    return storage[roomId];
  },

  add: function(roomId, socket) {
    if (!storage[roomId]) {
      storage[roomId] = [];
    }
	
	if( storage[roomId].length > 0){
		var foundSocket = _.find(storage[roomId], function(s) {
          return s.id === socket.id;
        });
		
		if(!foundSocket){
			storage[roomId].push(socket);
		}
	}else{
		storage[roomId].push(socket);
	}

    
  },

  //remove socket by id
  remove: function(socket) {
    for(let o in storage) {
      _.remove(storage[o], function(client) {
        return client.id === socket.id;
      });
    }
  },

  /**
  * emit event to model id
  */
  emitToRoom: function(roomId, event, data, exceptSockets) {
    _.each(storage[roomId], function(socket) {
      if (exceptSockets) {
        //find this socket in the array
        var foundSocket = _.find(exceptSockets, function(s) {
          return s.id === socket.id;
        });

        if (!foundSocket) { socket.emit(event, data); }
      } else {
        socket.emit(event, data);
      }
    });
  }
};