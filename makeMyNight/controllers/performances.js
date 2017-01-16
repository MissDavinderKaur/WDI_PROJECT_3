const Venue = require('../models/venue');

function venuesIndex(req, res) {
  Venue.find({
    latitude: { $ne: null },
    longitude: { $ne: null },
    'events.0': { $exists: true }
  }, (err, venues) => {
    if (err) return res.status(500).json(err);
    console.log(venues.length);
    return res.status(200).json(venues);
  });
}

module.exports = {
  index: venuesIndex
};
