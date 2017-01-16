const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');
const venues          = require('../controllers/venues');
const performances    = require('../controllers/performances');

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);

router.route('/users/:id')
  .get(users.show);

router.route('/venues')
  .get(venues.index);
router.route('/events/:id/performances')
  .get(performances.show);

module.exports = router;
