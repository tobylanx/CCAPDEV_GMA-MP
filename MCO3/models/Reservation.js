const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratory', required: true },
  seatnum: { type: Number, required: true },
  reservedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  anonymous: { type: Boolean, required: true },
  timeslot: {
    date: { type: Date, required: true },
    timestart: { type: String, required: true }
  },
  dateReserved: { type: Date, default: Date.now }
});

reservationSchema.index({ labID: 1, 'timeslot.date': 1, 'timeslot.timestart': 1, seatnum: 1 }, { unique: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = { Reservation, reservationSchema };

