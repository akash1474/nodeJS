const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}:${err.value}`, 400);
};

const handleDuplicationError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate field value ${value}. Please use another value`;
  return new AppError(msg, 400);
};

const handleValidationError = (err) => {
  const msg = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(`Invalid =>${msg}`, 400);
};
const runDevError = (err, res) => {
  res.status(err.statusCode).json({
    name: err.name,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const runProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error', err);
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went very wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    runDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicationError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);

    runProdError(error, res);
  }
};
