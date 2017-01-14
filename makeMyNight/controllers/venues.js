const Venue = require('../models/venue');

function venuesIndex(req, res) {

}

module.exports = {
  index: venuesIndex
};


// function showVenuesWithEvents(req, res) {
//
//   const optionsForVenueAPIRequest = {
//     uri: 'https://api.londontheatredirect.com/rest/v2/Venues',
//     headers: {
//       'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
//     }
//   };
//
//   var promise = new Promise((resolve, reject) => {
//     rp(optionsForVenueAPIRequest);
//   });
//
//   promise.then(htmlString => {
//     const data = JSON.parse(htmlString);
//     const londonTheatres = data.Venues.filter(v => v.City === 'London')
//
//     londonTheatres.forEach(function (theatre, index) {
//       VenueAndEvent.Create({
//         venueID: theatre.VenueID,
//         name: theatre.Name,
//         postcode: theatre.Postcode
//       });
//     });
//   });
//
//   promise.then(VenueAndEvent.find(), (err, theatres) => {
//     if (err) return console.log(err);
//
//     const geoCoder = new google.maps.Geocoder();
//     theatres.forEach(function (theatre, index) {
//
//       setTimeout(function() {
//         geoCoder.geocode({'address': theatre.postcode }, function(results, status) {
//           if (status == google.maps.GeocoderStatus.OK) {
//             theatre.latitude = results[0].geometry.location.lat();
//             theatre.longitude = results[0].geometry.location.lng();
//             //need to save
//           }
//           else { console.log(status) };
//         });
//       }, index * 50);
//     });
//   });
//
//   promise.then(VenueAndEvent.find(), (err, theatres) => {
//     theatres.forEach(function (theatre, index) {
//       const url = `https://api.londontheatredirect.com/rest/v2/Venues/${theatre.venueID}/Events`;
//
//       const optionsForEventAPIRequest = {
//         uri: url ,
//         headers: {
//           'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
//         }
//       };
//
//       rp(optionsForEventAPIRequest)
//       .then(htmlString => {
//         const data = JSON.parse(htmlString);
//         data.forEach(function (venueEvent, index) {
//           theatre.events.push({
//             eventID: venueEvent.EventId,
//             name: venueEvent.Name
//           });
//         });
//       });
//     });
//   });
//
//   promise.then(VenueAndEvent.find({ events: notEmpty() }), (err, venues) => {
//     if (err) return console.log(err);
//     console.log(venues);
//     return res.status(200).json(venues);
//   });
// }
//
//
// module.exports = {
//   index: showVenuesWithEvents
// };
