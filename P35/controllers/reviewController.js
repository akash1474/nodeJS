// const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

const handlerFactory = require('./handlerFactory');

exports.getAllReviews = handlerFactory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });
exports.setTourUserIds = (req, res, next) => {
  //ALLOW NESTED ROUTE
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = handlerFactory.createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   //ALLOW NESTED ROUTE
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.getReview = handlerFactory.getOne(Review);
