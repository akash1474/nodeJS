const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      max: [
        5.0,
        'Rating should be greater than 1.0 and less than or equal to 5.0',
      ],
      min: [
        1.0,
        'Rating should be greater than 1.0 and less than or equal to 5.0',
      ],
      required: [true, 'A review must have a rating'],
      default: 3.0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belog to a tour'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belog to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, //MATCHED ALL THE REVIEW THAT MATCHED THE GIVEN TOUR ID
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //THIS POINTS TO CURRENT REVIEW
  this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  //  this.r = await this.findOne(); //////DOES NOT WORKS HERE
  await this.r.constructor.calcAvgRatings(this.r.tour);
});

const reviewModel = mongoose.model('Review', reviewSchema);
module.exports = reviewModel;
