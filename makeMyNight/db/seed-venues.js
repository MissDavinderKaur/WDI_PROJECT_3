const rp         = require('request-promise');
const Promise    = require('bluebird');
const mongoose   = require('mongoose');
const geocoder   = require('geocoder');
mongoose.Promise = Promise;
const Venue      = require('../models/venue');

const databaseURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/makemynight';
mongoose.connect(databaseURL);

Venue.collection.drop();

rp({
  uri: 'https://api.londontheatredirect.com/rest/v2/Venues',
  headers: {
    'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
  }
})
.then(data => {
  const json = JSON.parse(data);
  const londonTheatres = json.Venues.filter(v => v.City === 'London');

  return Promise.map(londonTheatres, (theatre, i) => {
    console.log(`${i}`);
    return Venue.create({
      venueID: theatre.VenueId,
      name: theatre.Name,
      postcode: theatre.Postcode
    });
  });
})
.then(venues => {

  return Promise.map(venues, (venue, i) => {
    console.log(`Getting geocode for ${i} : ${venue}`);
    if(venue.postcode !== null) {
      geocoder.geocode(venue.postcode, function (err, data) {
        if ( data.status === 'OK') {
          venue.latitude = data.results[0].geometry.location.lat;
          venue.longitude = data.results[0].geometry.location.lng;
          venue.save();
          console.log(`New venue: ${venue}`);
        }
      });
    }
  });
})
.catch(err => {
  console.log(err);
});
