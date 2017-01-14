const rp         = require('request-promise');
const Promise    = require('bluebird');
const mongoose   = require('mongoose');
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
  console.log(`${venues.length} were saved`);
  process.exit();
})
.catch(err => {
  console.log(err);
});
