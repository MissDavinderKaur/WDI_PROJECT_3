const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  type: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Booking', bookingSchema);
