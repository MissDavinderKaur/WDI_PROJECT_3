const mongoose = require('mongoose');

const databaseURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/makemynight';
mongoose.connect(databaseURL);

const User = require('../models/user');
const Booking = require('../models/booking');
const Plan = require('../models/plan');

User.collection.drop();
Booking.collection.drop();

const dinner1 = new Booking({
  type: 'Dinner',
  description: 'Dishoom'
});
dinner1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const show1 = new Booking({
  type: 'Show',
  description: 'Top Hat'
});
show1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const drinks1 = new Booking({
  type: 'Drinks',
  description: '100 Wardour'
});
drinks1.save((err, booking) => {
  if (err) return console.log(err);
  console.log(`${booking.description} was saved`);
});

const plan1 = new Plan({
  name: 'Birthday',
  date: new Date('March 10, 2017 00:00:00'),
  attendees: 3,
  bookings: [dinner1, show1, drinks1]
});
plan1.save((err, plan) => {
  if (err) return console.log(err);
  console.log(`${plan.name} was saved`);
});

const user1 = new User({
  name: 'Davinder Kaur',
  mobile: 447912616458,
  emailAddress: 'miss_davinder_kaur@hotmail.co.uk',
  password: 'davinder',
  passwordConfirmation: 'davinder',
  plans: [plan1]
});

user1.save((err, user) => {
  if (err) return console.log(err);
  console.log(`${user.name} was saved`);
});
