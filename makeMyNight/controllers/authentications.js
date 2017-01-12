const User    = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function registerNewUser(req, res) {
  User.create(req.body.user, (err, user) => {
    if (err) console.log(err);

    const stringID = (user._id).toString();
    const objectForJWT = {
      stringId: stringID
    };

    const token = jwt.sign(objectForJWT, config.secret, { expiresIn: 60*60*24 });
    return res.status(200).json({
      message: `Welcome ${user.name}!`,
      token,
      user
    });
  });
}

function userLogin(req, res){
  User
    .findOne({ emailAddress: req.body.emailAddress })
    .populate(['plans.bookings'])
    .exec((err, user) => {
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      if (!user || !user.checkIfCorrectPasswordEntered(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorized.' });
      }

      const stringID = (user._id).toString();
      const objectForJWT = {
        stringId: stringID
      };

      const token = jwt.sign(objectForJWT, config.secret, { expiresIn: 60*60*24 });

      return res.status(200).json({
        message: `Welcome ${user.name}!`,
        user,
        token
      });
    });
}

module.exports = {
  register: registerNewUser,
  login: userLogin
};
