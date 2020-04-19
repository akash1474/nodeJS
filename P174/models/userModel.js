const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide your email!!'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [8, 'Password should be greater than or equal to 8'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this fn if the password was modified
  if (!this.isModified('password')) return next();
  //Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  //Clearing the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (canditatePass, userPasss) {
  return bcrypt.compare(canditatePass, userPasss);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = (this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
