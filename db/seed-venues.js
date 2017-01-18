const rp         = require('request-promise');
const Promise    = require('bluebird');
const mongoose   = require('mongoose');
const chalk      = require('chalk');
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
  console.log(chalk.green(`${londonTheatres.length} venues found`));
  return Promise.map(londonTheatres, (theatre, i) => {
    console.log(chalk.yellow(`${i}. ${theatre.Name} has been created`));
    return Venue.create({
      venueID: theatre.VenueId,
      name: theatre.Name,
      postcode: theatre.Postcode
    });
  });
})
.then(venues => {
  console.log(chalk.green(`${venues.length} venues were created!`));
  return Promise.map(venues, (venue, i) => {
    console.log(chalk.yellow(`Updating the lat and lng for ${venue.name}`));
    return delay(i*150).then(() => {
      return venue.updateLatLng();
    });
  });
})
.then(venues => {
  console.log(chalk.green(`${venues.length} venues were updated with lat and lngs!`));
  return Promise.map(venues, (venue, i) => {
    if (typeof venue === 'undefined') {
      console.log(`BROKEN VENUE ${venue}`);
      return;
    }
    console.log(`Updating the events for ${venue.name}`);
    return delay(i*500).then(() => {
      return venue.getEvents();
    });
  });
})
.then(venues => {
  console.log(chalk.green(`${venues.length} venues were updated with events!`));
  console.log(chalk.red('FINISHED', venues));
  return process.exit();
})
.catch(err => {
  console.log(err);
});

function delay(t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}
