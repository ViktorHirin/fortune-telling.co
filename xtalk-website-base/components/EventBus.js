var EventEmitter = require('events').EventEmitter
  , underscore = require('lodash')
  , util = require('util');

function EventBus() {
  EventEmitter.call(this);
  this.queue = [];
  this.useQueue = [];
  this.current = this.nest = null;
}

util.inherits(EventBus, EventEmitter);

EventBus.create = function() {
  return new EventBus();
};

EventBus.prototype.emit = function(eventName) {
  var self = this
    , args = arguments;

  console.log('Emitting ' + eventName + '...');
  if (~eventName.indexOf('::')) {
      var nest = function(eventName, level) {
        var tmpEvent = eventName.split('::', level).join('::');
        EventEmitter.prototype.emit.apply(self, [tmpEvent].concat([].slice.call(args, 1)).concat([function(err) {
          if (err) {
            return console.log(err);
          }

          tmpEvent !== eventName && nest(eventName, ++level);
        }]));
      };

      nest(eventName, 1);
  } else {
    return EventEmitter.prototype.emit.apply(this, arguments);
  }
};

EventBus.prototype.use = function(eventName, listener) {
  this.useQueue.push(eventName);
  this.onSeries(eventName, listener);
};

EventBus.prototype.onSeries = function(eventName, listener) {
  var self = this;

  EventEmitter.prototype.on.call(this, eventName, function(data) {
    if (listener.length !== 2) {
      return listener.apply(this, arguments);
    }

    self.queue.push({
      data: data,
      listener: listener,
      eventName: eventName,
      arguments: arguments
    });

    next.call(self);
  });
};

function next() {
  var self = this
    , item = this.queue[0];

  if (!item){
    self.nest && typeof self.nest === 'function' && self.nest();
    return this.emit("bus:queue-empty", {});
  }

  if (item !== this.current) {
    this.current = item;
    item.listener.call(this, item.data, function(err, result) {
      if (err) {
        throw err;
      }

      !underscore.isEmpty(result) && underscore.extend(self.queue[0].data, result);
      self.queue.shift();
      self.current = self.nest = null;
      if (~self.useQueue.indexOf(item.eventName)) {
        self.useQueue.shift();
      }

      if (!self.queue.length && !~self.useQueue.indexOf(item.eventName)) {
        var argsArr = [].slice.call(item.arguments);
        self.nest = argsArr[argsArr.length - 1];
      }
      next.call(self);
    });
  }
}
module.exports = new EventBus();