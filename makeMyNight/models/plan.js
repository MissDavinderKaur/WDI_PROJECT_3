const mongoose   = require('mongoose');
const dateformat = require('dateformat');

const planSchema = new mongoose.Schema({
  name: { type: String },
  date: { type: Date, get: v => dateformat(v, 'formattedDate') },
  attendees: { type: Number },
  bookings: [{ type: mongoose.Schema.ObjectId, ref: 'Booking' }]
}, {
  toJSON: {
    getters: true
  }
});

dateformat.masks.formattedDate = 'dddd dS mmmm, yyyy';

module.exports = mongoose.model('Plan', planSchema);
