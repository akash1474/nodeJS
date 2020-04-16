/* eslint-disable prettier/prettier */
// const fs = require('fs');

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkId = (req, res, next, val) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  next();
};

exports.checkBody = (req, res, next) => {
  // if (!req.body.name || !req.body.price) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'No data was provided to post',
  //   });
  // }
  next();
};
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//!!IMPORTANT!!!
//query=Tour.find()
//queryStr=req.query;

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  //BUILD THE QUERY

  //1A]FILTERING

  // //Removing the elements in excludedFields present in te query and making it simple to work
  // //1A]FILTERING
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);
  // //req.query=>Return the query passed when making the request

  // //1B]ADVANCED FILTERING

  // //Converting the simple query to mongodb query by adding a '$' symbol before the argument ie gte to $gte
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // let query = Tour.find(JSON.parse(queryStr));

  // //2]SORTING
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // //3]FIELD LIMITING
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select(''); //start form here ak of 09-04-2020
  // }
  // cont query=Tour.find()
  // .where('duration')
  // .equals(5)
  // .where('difficulty')
  // .equals('easy');
  // //4]PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('Page does exists');
  // }
  // //EXECUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('The entered ID did not match to any!!!', 404));
  }

  res.status(204).json({
    status: 'success',
    message: null,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('The entered ID did not match to any!!!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Tour.find({__id:djdi8df89df9d});

  if (!tour) {
    return next(new AppError('The entered ID did not match to any!!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //consists of stages
    {
      $match: { ratingsAverage: { $gte: 4.3 } }, //Just a query
    },
    {
      //Allows to group the documents using accmulators
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 }, //Adss 1 for each document
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $avg: '$price' },
        maxPrice: { $avg: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //splitting the startDates
    },
    {
      $match: {
        //Matching between the given parameters
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, //0=> hide 1=>shows
      },
    },
    {
      $sort: { numTourStarts: -1 }, //1 ascending -1 descnding
    },
    // {
    //   $limit: 6,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
