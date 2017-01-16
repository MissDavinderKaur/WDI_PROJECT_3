const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String },
  date: { type: Date },
  attendees: { type: Number },
  bookings: [{ type: mongoose.Schema.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('Plan', planSchema);
