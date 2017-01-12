const mongoose = require('mongoose');

const databaseURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/makemynight';
mongoose.connect(databaseURL);

const User = require('../models/user');
const Booking = require('../models/booking');

User.collection.drop();
Booking.collection.drop();

const dinner1 = new Booking({
  type: 'Dinner',
  description: 'Dishoom',
  postcode: 'dinnerPostcode'
});
dinner1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const show1 = new Booking({
  type: 'Show',
  description: 'Top Hat',
  postcode: 'showPostcode'
});
show1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const drinks1 = new Booking({
  type: 'Drinks',
  description: '100 Wardour',
  postcode: 'drinksPostcode'
});
drinks1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const dinner2 = new Booking({
  type: 'Dinner',
  description: 'Pizza Express',
  postcode: 'dinnerPostcode'
});
dinner2.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const show2 = new Booking({
  type: 'Show',
  description: 'Singing in the Rain',
  postcode: 'showPostcode'
});
show2.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const drinks2 = new Booking({
  type: 'Drinks',
  description: 'Be at One',
  postcode: 'drinksPostcode'
});
drinks2.save((err, booking) => {
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
    bookings: [dinner1, show1, drinks1]
  }, {
    name: 'Sisters Meet Up',
    date: new Date('March 17, 2017 00:00:00'),
    attendees: 3,
    bookings: [dinner2, show2, drinks2]
  }]
});

user1.save((err, user) => {
  if (err) return console.log(err);
  console.log(`${user.name} was saved`);
});
