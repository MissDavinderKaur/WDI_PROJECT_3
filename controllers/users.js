const User = require('../models/user');
const Plan = require('../models/plan');

function showUser(req, res){
  User.findById(req.params.id)
  .populate('plans')
  .exec((err, user) => {
    if(err) return console.log(err);
    return res.status(200).json(user);
  });
}

module.exports = {
  show: showUser
};
