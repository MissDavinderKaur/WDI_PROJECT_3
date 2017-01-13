const rp = require('request-promise');

function showVenues(req, res){
  const options = {
    uri: 'https://api.londontheatredirect.com/rest/v2/Venues',
    headers: {
      'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
    }
  };
  return rp(options)
  .then(htmlString => {
    const venues = JSON.parse(htmlString);
    const londonTheatres = venues.Venues.filter(t => t.City === 'London');
    return res.status(200).json(londonTheatres);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json(err);
  });
}

module.exports = {
  show: showVenues
};
