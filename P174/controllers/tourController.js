const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTours = catchAsync(async (req, res, next) => {
  //WORK ON APIFEATURES
  const features = await new APIFeatures(Tour.find(), req.query)
    .sort()
    .filter()
    .fieldLimiting()
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
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

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) next(new AppError('The entered ID didnot match to any!!!', 404));

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) next(new AppError('The entered ID didnot match to any!!!', 404));
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  if (!tour) next(new AppError('The entered ID didnot match to any!!!', 404));
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
