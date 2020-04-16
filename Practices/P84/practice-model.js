const mongoose = require('mongoose');
//CREATING THE SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'User must have a name'],
    unique: true,
  },
  photo: {
    type: String,
    trim: true,
    required: [true, 'User must have a name'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User age must be defined'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    trim: true,
    default: 'user',
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
