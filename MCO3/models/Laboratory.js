const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatnum: Number,
});

const laboratorySchema = new mongoose.Schema({
  labname: String,
  location: String,
  capacity: Number,
  seats: [seatSchema],
});

const Laboratory = mongoose.model('Laboratory', laboratorySchema);

module.exports = Laboratory;
