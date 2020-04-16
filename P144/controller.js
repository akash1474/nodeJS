const Tour = require('./model');
const catchAsync = require('./catchAsync');
const AppError = require('./AppError');
//Get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    tours,
  });
});

//Create new Tour
exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(res.body);
  if (!tour) return new AppError('The entered ID did not match any', 404);
  res.status(200).json({
    status: 'success',
    tour,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return new AppError('The entered ID did not match any', 404);
  res.status(200).json({
    status: 'success',
    tour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) return new AppError('The entered ID did not match any', 404);
  res.status(200).json({
    status: 'success',
    message: `Tour with the ID:${req.params.id} has been successfully deleted`,
    tour,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) return new AppError('The entered ID did not match any', 404);
  res.status(200).json({
    status: 'success',
    tour,
  });
});
