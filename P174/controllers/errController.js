const AppError = require('../utils/appError');

const handleJsonWebTokenError = () =>
  new AppError('Invalid token please login again', 401);

const handleTokenExpiredError = () =>
  new AppError(`Your token has expired please login again`, 401);

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}:${err.value}`, 400);
};

const handleDuplicationErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate field value ${value}. Please use another value`;
  return new AppError(msg, 400);
};

const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = errors.join('. ');
  return new AppError(msg, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational error,trust error :send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming error or other exernal error:doesn't leak the info to the client
    //1]Log the error
    console.error(`ERROR!!!`, err);
    //2]Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicationErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidatorError(error);
    if (err.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    if (err.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    sendErrorProd(error, res);
  }
};
