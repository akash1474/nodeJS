const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be specified'],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    required: [true, 'Ratings quantity must be defined'],
  },
  difficulty: {
    type: String,
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty should be eitheer easy,medium or difficult',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price must be defined'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Image Cover of tour is required'],
  },
  startDates: [String],
});

const Tour = mongoose.model('P114', schema);
module.exports = Tour;
