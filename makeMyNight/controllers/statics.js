const path = require('path');

function renderHome(req, res){
  return res.sendFile(path.join(__dirname, '../index.html'));
}

module.exports = {
  home: renderHome
};
