const AppError = require('../utils/appError');
//Check the issues not working
const handleJsonWebTokenError = () =>
  new AppError('Invalid Token Please login again!!', 401);

const handleTokenExpiredError = () =>
  new AppError('Your token has expired!! Please login in again!!', 401);
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate field value ${value}. Please use another value`;
  return new AppError(msg, 400);
};
const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B]RENDERED WEBSITE
  console.error(`ERROR!!!`, err);

  return res.status(err.statusCode).render('error', {
    title: 'Somethings went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //A]API
    //Operational error,trust error :send message to the client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming error or other exernal error:doesn't leak the info to the client
    //1]Log the error
    console.error(`ERROR!!!`, err);
    //2]Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!!!',
    });
  }
  //RENDERED WEBSITE
  //Operational error,trust error :send message to the client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somethings went wrong',
      msg: err.message,
    });
  }
  //Programming error or other exernal error:doesn't leak the info to the client
  //1]Log the error
  console.error(`ERROR!!!`, err);
  //2]Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Somethings went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error); //ID error
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
