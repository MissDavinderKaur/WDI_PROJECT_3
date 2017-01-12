const mongoose = require('mongoose');

const databaseURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/makemynight';
mongoose.connect(databaseURL);

const User = require('../models/user');
const Booking = require('../models/booking');

User.collection.drop();
Booking.collection.drop();

const dinner = new Booking({
  type: 'Dinner',
  description: 'Dishoom',
  postcode: 'dinnerPostcode'
});
dinner.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const show = new Booking({
  type: 'Show',
  description: 'Top Hat',
  postcode: 'showPostcode'
});
show.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const drinks = new Booking({
  type: 'Drinks',
  description: '100 Wardour',
  postcode: 'drinksPostcode'
});
drinks.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const user1 = new User({
  name: 'Davinder Kaur',
  mobile: 447912616458,
  emailAddress: 'miss_davinder_kaur@hotmail.co.uk',
  password: 'davinder',
  passwordConfirmation: 'davinder',
  plans: [{
    name: 'Birthday night out',
    date: new Date('March 10, 2017 00:00:00'),
    attendees: 3,
    bookings: [dinner, show, drinks]
  }]
});

user1.save((err, user) => {
  if (err) return console.log(err);
  console.log(`${user.name} was saved`);
});
