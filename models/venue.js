const mongoose = require('mongoose');
const Promise  = require('bluebird');
// Converted this library to use promises...
const geocoder = Promise.promisifyAll(require('geocoder'));
const rp       = require('request-promise');

const venueSchema = new mongoose.Schema({
  venueID: {type: String, trim: true },
  name: { type: String, trim: true },
  postcode: { type: String, trim: true },
  latitude: {type: String, trim: true },
  longitude: {type: String, trim: true },
  events: [mongoose.Schema.Types.Mixed]
});

venueSchema.methods.updateLatLng = function() {
  // Unnecessary... but ?
  if (!this.postcode) return this.save();
  return geocoder
    .geocodeAsync(this.postcode)
    .then(data => {
      if (data.status == 'OK') {
        this.latitude = data.results[0].geometry.location.lat;
        this.longitude = data.results[0].geometry.location.lng;
        console.log(`Adding ${this.latitude},${this.longitude} ${this.name}`);
        return this.save();
      }
    })
    .catch(() => {
      // Unnecessary... but ?
      return this.save();
    });
};

venueSchema.methods.getEvents = function() {
  const url = `https://api.londontheatredirect.com/rest/v2/Venues/${this.venueID}/Events`;
  return rp({
    uri: url,
    headers: {
      'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
    }
  })
  .then(data => {
    const events = JSON.parse(data).Events;
    console.log(`Adding ${events.length} events for ${this.name}`);
    this.events = events;
    return this.save();
  })
  .catch(() => {
    // Unnecessary... but ?
    return this.save();
  });
};

module.exports = mongoose.model('Venue', venueSchema);

// However, we need to write this because geocoder.geocode doesn't work
// http://stackoverflow.com/questions/31752154/whats-the-easiest-way-to-bluebird-promisify-a-function-with-its-callback-as-the
geocoder.geocodeAsync = function (string, options) {
  return Promise.fromCallback(function (callback) {
    geocoder.geocode(string, callback, options);
  });
};
