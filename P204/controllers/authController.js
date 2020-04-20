const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signTokenAndSend = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOpt = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOpt.secure = true;
  res.cookie('jwt', token, cookieOpt);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  //1]GET THE REQUIRED USER DATA
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  if (!user) return next(new AppError(`Please provide the complete data`, 404));

  //2]SAVE THE DATA BY ENCODING IT
  signTokenAndSend(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  //1]GET THE EMAIL AND PASSWORD
  const { email, password } = req.body;

  //CHECK IF EMAIL AND  PASSWORD EXISTS
  if (!email || !password)
    return next(new AppError('Please provide email and password!!!', 400));
  //CHECK IF THE USER EXISTS AND THE PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email or password!!!', 401));
  }
  //SEND THE RESPONSE IF ALL RIGHT
  signTokenAndSend(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1]GET THE TOKEN FOR THE AUTHORIZATION HEADER
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }
  if (!token) {
    next(
      new AppError(`You are not logged in. Please login to get access`, 401)
    );
  }
  //2]DECODE THE TOKEN
  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
  //3]FIND THE USER BY VERIFYING THE JWT
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token does not exits!!!', 401)
    );
  }
  //4]CHECK IF THE PASSWORD WAS CHANGED AFTER THE TOPKEN WAS VERIFIED
  if (user.passwordChangeAfter(decodedToken.iat)) {
    return next(new AppError('User recently changed the passord!!', 401));
  }
  //5]SEND THE TOKEN
  req.user = user;
  next();
});
