const AppError = require('./AppError');

const handleCastError = (err) => {};

const handleDuplicationErrorDB = (err) => {};
const handleValidationErrorDB = (err) => {};

const runDevError = (err, res) => {
  res.status(err.stausCode).json({
    error: err,
    status: err.status,
    stack: err.stack,
    message: err.message,
  });
};

const runProdError = (err, res) => {
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    runDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicationErrorDB(error);

    runProdError(error, res);
  }
};
