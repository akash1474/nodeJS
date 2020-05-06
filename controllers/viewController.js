const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1]GET TOUR DATA FROM COLLECTION
  const tours = await Tour.find();
  //2]BUILD TEMPLAE

  //3]RENDER THE TEMPLATE USING THE TOUR DATA

  res.status(200).render('overview', {
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1]GE THE DATA FOR THE REQUEST TOURS INCLUDING REIVEWS AND GUIDES
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is not tour with that name', 404));
  }
  //2]BUILD TEMPLATE

  //3]RENDER TEMPLATE THE DATA FROM  1]]

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1]Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2]Find tours with the returened IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(201).json({
    title: 'Your account',
    user: updateUser,
  });
});
