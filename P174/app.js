const express = require('express');

const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const errController = require('./controllers/errController');

dotenv.config({ path: './config.env' });

app.use(express.json());
app.use(morgan('dev'));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!!!`, 404));
});

app.use(errController);

module.exports = app;
