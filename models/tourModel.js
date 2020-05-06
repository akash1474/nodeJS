/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'Tour name is must have less than 40 but greater than 10 words',
      ],
      minlength: [
        10,
        'Tour name is must have less than 40 but greater than 10 words',
      ],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a durations'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a gropu size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be either easy medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      //this only points to the curretn doc on NEW DOCUMENT creation
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  }, //Virtual Properites
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });
/*
///////////  VIRTUAL PROPERTY   /////////
FIELDS DEFINED IN SCHEMA BUT ARE NOT PERSISTANT OR SAVED IN DATABASE
ARE DEFINED ON SCHEMA
CANNOT USE TOUR.FIND(DURATIONWEEKS) AS IT IS NOT PRESENT IN THE DATABASE
*/
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//MONGOOSE
//TYPES => DOCUMENT QUERY AGGREGATE AND MODEL
//DEFINED ON SCHEMA

//DOCUMENT MIDDLEWARE
//=> RUNS BEFORE THE .save() and .create() COMMAND BUT NOT .insertMany()
// I.E RUNS ONLY ON  SAVE AND CREATE
//PRE ONLY HAD ACCESS TO NEXT BUT NOT DOC
tourSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guides = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guides);
//   next();
// });
//also called pre save hook or middleware
// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

//EXECUCTED AFTER ALL PRE MIDDLWARE HAVE FINISHED
//HAS ACCESS TO NEXT AND THE DOC WHICH IS SAVED
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next(); //not necessary but we should
// });

//QUERY MIDDLEWARE
//HERE "THIS" POINTS TO QUERY BUT NOT THE DOCUMENT
//RUNS BEFORE ANY QUERY IS EXECUTED

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  //   /^find/ means all the strings start with find
  //this is same as Tour.find() it is executed before Tour.find() int he toursController.js
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now(); //We can also add our own propertyies ot tour queries
  next();
}); //does not works for findOne()

tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  // console.log(`Time:${Date.now() - this.start}`);
  next();
});

//AGGREGATION MIDDLEWARE
//EXECUTED BEFORE[.pre] AND AFTER[.post] THE AGGRATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //removing the document having the secret documnet
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
