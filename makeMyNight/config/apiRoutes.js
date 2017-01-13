const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');
const venues           = require('../controllers/venues');

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);

router.route('/users/:id')
  .get(users.show);

router.route('/venues')
  .get(venues.show);

module.exports = router;
