const rp         = require('request-promise');

function performancesShow(req, res) {
  rp({
    uri: `https://api.londontheatredirect.com/rest/v2/Events/${req.params.id}/Performances`,
    headers: {
      'Api-Key': 'zfjasg2egrnu6skgcfrcjepq' //process.env.THEATRE_DIRECT_API_KEY
    }
  })
  .then(data => {
    const performances = JSON.parse(data)
    return res.status(200).json(performances);
  })
  .catch(console.log);
}

module.exports = {
  show: performancesShow
};
