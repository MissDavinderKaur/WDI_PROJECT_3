const User = require('../models/user');

function showUser(req, res){
  User.findById(req.params.id)
  .populate('plans.bookings')
  .exec((err, user) => {
    if(err) return console.log(err);
    return res.status(200).json(user);
  });
}

function editUser(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return console.log(err);
    return res.status(200).json(user);
  });
}

function updateUser(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body.user, { new: true }, (err, user) => {
    if (err) return console.log(err);
    return res.status(200).json(user);
  });
}


module.exports = {
  show: showUser,
  edit: editUser,
  update: updateUser
};
