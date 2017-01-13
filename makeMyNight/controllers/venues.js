const rp = require('request-promise');

function showVenues(req, res){
  const options = {
    uri: 'https://api.londontheatredirect.com/rest/v2/Venues',
    headers: {
      'Api-Key': 'zfjasg2egrnu6skgcfrcjepq'
    }
  };
  return rp(options)
  .then(htmlString => {
    console.log(htmlString);
    const json = JSON.parse(htmlString);
    return res.status(200).json(json);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json(err);
  });
}

module.exports = {
  show: showVenues
};
