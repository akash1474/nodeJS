const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .paginate();

  const tours = await features.query;
  let page = req.query.page * 1 || 1;
  if (page === 0) {
    page = 1;
  }
  // req.query.page * 1 ? (0 ? 1 : req.query.page * 1) : req.query.page * 1;
  console.log(page);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    page: page,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('Provided ID did not matched!!!', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(tour);
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
exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  console.log(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('Some Error occured!!!', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
