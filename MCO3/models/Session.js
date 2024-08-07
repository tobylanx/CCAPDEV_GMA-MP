const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionToken: String,
  dateStart: { type: Date, default: Date.now },
  dateExpired: Date,
});

const Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;
