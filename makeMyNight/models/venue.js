const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venueID: {type: String },
  name: { type: String },
  postcode: { type: String },
  latitude: {type: String },
  longitude: {type: String },
  events: [{
    eventID: {type: String},
    name: {type: String }
  }]
});

module.exports = mongoose.model('Venue', venueSchema);
