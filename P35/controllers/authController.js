const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
//401 UNAUTHORIZED
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1]CHECK IF EMAIL AND PASSWORD EXISTS
  if (!email || !password) {
    return next(new AppError('Please provide email and password!!', 400));
  }
  //2]CHECK IF THE USE EXISTS AND ALSO THE PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3]IF ALL CORRECT SENT TOKEN TO THE CLIENT

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'Logged Out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

//ONLY FOR RENDERED PAGES
exports.isLoggedIn = async (req, res, next) => {
  //1]GETTING THE TOKEN AND CHECK
  if (req.cookies.jwt) {
    try {
      //2]VERIFY TOKEN
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );
      //3]CHECK IF USER STILL EXISTS
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //4]CHECK IF USER CHANGED PASSWORD AFTER THE JWT WAS ISSUED
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      //THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  //1]GETTING THE TOKEN AND CHECK
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in.Please login to get access', 401)
    );
  }
  //2]VERIFY TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  //3]CHECK IF USER STILL EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exits!!!', 401)
    );
  }
  //4]CHECK IF USER CHANGED PASSWORD AFTER THE JWT WAS ISSUED
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed the passord!!', 401));
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have permission to perform this action', 403)
      ); //forbidenn
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1]GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  //2]GENERATE A RANDOM TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3]SEND IT BACK AS EMAIL
  const resetURL = `${req.portocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password ? Try submitting a patch request with your new password and confirm Password to :${resetURL}.\n`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token only available for 10 mins',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error while sending email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1]GET USER BASED ON TOKEN
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2]IF TOKEN HAS NOT EXPIRED AND THERE IS USE SET THE NEW PASSWORD
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //3]UPDATE changePasswordAt property of user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //4]LOG THE USER IN AND SEND JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1]GET THE USER FROM COLLECTION
  const user = await User.findById(req.user.id).select('+password');

  //2]CHECK IF POSTED CURRENT PASSWORD IS CORRECT
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!!!'));
  }
  //3]IF SO UPDATE PASSWORD
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4]LOG USER IN AND SEND JWT
  createSendToken(user, 200, res);
});
