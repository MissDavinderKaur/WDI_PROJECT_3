const User = require('../models/user');
const Plan = require('../models/plan');
//const Booking = require('../models/booking');

function showPlan(req, res){
  Plan.findById(req.params.plan_id)
  .populate('bookings')
  .exec((err, plan) => {
    if(err) return console.log(err);
    return res.status(200).json(plan);
  });
}

function plansCreate(req, res) {
  User.findById(req.params.id, (err, user) => {
    if(err) return res.status(500).json(err);
    if(!user) return res.status(404).json({ message: 'No User Found.' });

    Plan.create(req.body.plan, (err, plan) => {
      if(err) return res.status(500).json(err);
      user.plans.push(plan);
      user.save((err, user) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(plan);
      });
    });
  });
}

function plansUpdate(req, res) {
  console.log('then this');
  Plan.findByIdAndUpdate(req.params.plan_id, req.body, {new: true})
  .populate('bookings.booking')
  .exec((err, plan) => {
    if(err) return res.status(500).json(err);
    if(!plan) return res.status(404).json({ message: 'No Plan Found.' });
    return res.status(200).json(plan);
  });
}

module.exports = {
  show: showPlan,
  create: plansCreate,
  update: plansUpdate
};
