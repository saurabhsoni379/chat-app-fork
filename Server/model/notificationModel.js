const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['contactRequest'], default: 'contactRequest' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 