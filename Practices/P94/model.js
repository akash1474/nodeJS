//IMPORT MONGOOSE
const mongoose = require('mongoose');
//CREATE SCHEMA
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
    select: false,
  },
  role: {
    type: String,
    trim: true,
    default: 'user',
  },
});
//CREATE MODEL
const User = mongoose.model('P94', userSchema);
//EXPORT MODEL
module.exports = User;
