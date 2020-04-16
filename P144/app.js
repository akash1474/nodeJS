//IMPORT THE MODULES
const express = require('express');

const morgan = require('morgan');
const AppError = require('./AppError');

const app = express();
const router = require('./router');
const errorController = require('./errorController');

app.use(express.json());
app.use(morgan('dev'));
//DEFINE THE ROUTES
app.use('/api/v1/tours', router);

//EXPORT THE APP

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

//Last thing to be seen
app.use(errorController);
module.exports = app;
