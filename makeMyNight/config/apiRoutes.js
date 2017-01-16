const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');
const venues          = require('../controllers/venues');
const performances    = require('../controllers/performances');
const plans           = require('../controllers/plans');
const booking         = require('../controllers/bookings');

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);

router.route('/users/:id')
  .get(users.show);
router.route('/users/:id/plans')
  .post(plans.create);
router.route('/users/:user_id/plans/:plan_id')
  .get(plans.show)
  .post(booking.create);

router.route('/venues')
  .get(venues.index);
router.route('/events/:id/performances')
  .get(performances.show);

module.exports = router;
