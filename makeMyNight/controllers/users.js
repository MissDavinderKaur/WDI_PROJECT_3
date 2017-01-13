const User = require('../models/user');

function showUser(req, res){
  User.findById(req.params.id)
  .populate('plans.bookings')
  .exec((err, user) => {
    if(err) return console.log(err);
    return res.status(200).json(user);
  });
}

module.exports = {
  show: showUser
};
