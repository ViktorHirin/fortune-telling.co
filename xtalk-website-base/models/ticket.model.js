var mongoose = require('mongoose');
Schema = mongoose.Schema;
var EventBus = require('../components/EventBus');
var Ticket = new mongoose.Schema({
  name:String,
  subject:String,
  phone: String,
  email:String,
  description: String,
  createdAt: {type: Date, default: Date.now},
});
Ticket.pre('save', function(next) {
  this.wasNew = this.isNew;
  next();
});
Ticket.post('save', function(doc) {
	var evtName = this.wasNew ? 'Ticket.Inserted' : 'Ticket.Updated';
	console.log('run emit envent '+this.isNew);
	EventBus.emit(evtName, doc);
});

// Delete model definition in case it is already defined
delete mongoose.models.ticket;
var ticket = mongoose.model('ticket', Ticket);
module.exports = ticket;
