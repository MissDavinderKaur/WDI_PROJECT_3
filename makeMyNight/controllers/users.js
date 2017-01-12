const User = require('../models/user');

function usersIndex(req, res){
  User.find()
  .exec((err, users) => {
    if (err) console.log(err);
    return res.status(200).json(users);
  });
}

function showUser(req, res){
  User.findById(req.params.id, (err, user) => {
    if(err) return console.log(err);
    return res.status(200).json(user);
  });
}

module.exports = {
  index: usersIndex,
  show: showUser
};
