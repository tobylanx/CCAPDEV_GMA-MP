const mongoose = require('mongoose');
const { reservationSchema } = require('./Reservation');

const timeslotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timestart: { type: String, required: true },
  labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratory', required: true },
});

const Timeslot = mongoose.models.Timeslot || mongoose.model('Timeslot', timeslotSchema);

module.exports = Timeslot;
