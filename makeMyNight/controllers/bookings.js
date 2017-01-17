const User = require('../models/user');
const Plan = require('../models/plan');
const Booking = require('../models/booking');


function bookingsCreate(req, res) {
  console.log('running');
  Plan.findById(req.params.plan_id, (err, plan) => {
    if(err) return res.status(500).json(err);
    if(!plan) return res.status(404).json({ message: 'No Plan Found.' });

    Booking.create(req.body, (err, booking) => {
      if(err) return res.status(500).json(err);
      plan.bookings.push(booking);

      plan.save((err, plan) => {
        if(err) return res.status(500).json(err);
        Plan.populate(plan, 'bookings', (err, plan) => {
          if(err) return res.status(500).json(err);
          return res.status(200).json(plan);
        });
      });
    });
  });
}

module.exports = {
  create: bookingsCreate
};
