const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1]CHECK IF THE EMAIL AND PASSWORD ARE PRESENT
  if (!email || !password)
    next(new AppError(`Please enter email and passowrd!!!`, 400));
  //2]CHECK IF USER EXISTS AND THE PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password'); //AS WE SAID PASSOWRD SELECT:FALSE

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Invalid Email or Password`, 401));
  }
  //3]SEND THE TOKEN
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1]GET THE TOKEN AND CHECK IT
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(new AppError('Your are not logged in please login', 401));
  }
  //2]VALIDATE THE TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  //3]CHECK IF THE USER STILL EXISTS
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user with this token does not exists', 401));
  }
  //4]CHECK IF THE USER CHANGED THE PASSOWRD AFTER THE JWT WAS ISSUED
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('The password was changed!!!'));
  }
  //5]GRANT ACCESS
  req.user = freshUser; //HERE WE ASSIGN A PROPERTY TO REQ SO WE CAN USER IT LATER
  next();
});
