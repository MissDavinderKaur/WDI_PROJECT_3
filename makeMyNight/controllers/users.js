const User = require('../models/user');

function usersIndex(req, res){
  User.find()
  .exec((err, users) => {
    if (err) console.log(err);
    return res.status(200).json(users);
  });
}

module.exports = {
  index: usersIndex

};
