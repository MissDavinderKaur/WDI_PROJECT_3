const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const Booking = require('./booking');
const Plan = require('./plan');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  mobile: { type: Number },
  emailAddress: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  plans: [{ type: mongoose.Schema.ObjectId, ref: 'Plan' }]
});

userSchema
  .path('emailAddress')
  .validate(checkEmailAddress);

function checkEmailAddress(enteredValue) {
  if(!validator.isEmail(enteredValue)) {
    return this.invalidate('emailAddress', 'A valid email address needs to be entered.');
  }
}

userSchema
  .virtual('password')
  .set(setPassword);

function setPassword(enteredValue) {
  this._password = enteredValue;
  this.passwordHash = bcrypt.hashSync(enteredValue, bcrypt.genSaltSync(8));
}

userSchema
  .virtual('passwordConfirmation')
  .set(setPasswordConfirmation);

function setPasswordConfirmation(enteredValue) {
  this._passwordConfirmation = enteredValue;
}

userSchema
.path('passwordHash')
.validate(checkPasswordHash);

function checkPasswordHash(){
  if (this.isNew) {
    if(!this._password){
      return this.invalidate('password', 'A password must be entered');
    }
    if (this._password !== this._passwordConfirmation){
      this.invalidate('passwordHash', 'The password and confirmation password do not match');
    }
  }
}

userSchema.methods.checkIfCorrectPasswordEntered = checkIfCorrectPasswordEntered;

function checkIfCorrectPasswordEntered(value){
  return bcrypt.compareSync(value, this.passwordHash);
}


module.exports = mongoose.model('User', userSchema);
