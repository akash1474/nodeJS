/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.static(`${__dirname}/public`));
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');

app.use(express.json());
app.use(morgan('dev'));
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
//installs via npm return info about file size duration status code and path
//middle ware
//must be used before all routes
//it exectes in the coded order
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   //we can define any property ot the req as shown
//   req.email = 'panditakash38@gmail.com';
//   next();
// });

// const tourToEdit = tours.find((el) => el.id === req.params.id * 1);
// console.log(tourToEdit);
// // tourToEdit.tours.splice(indexToDel, 0);
// // console.log(Object.keys(req.body), Object.values(req.body));
// const property = Object.keys(req.body);
// console.log(property[0]);
// // tourToEdit.property[0] = Object.values(req.body)[0];
// console.log(tourToEdit);

// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour: 'Tours were updated',
//   },
// });})
//TYPE ONE
// app.get('/api/v1/tours', getAllTours);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);

//TYPE TWO
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
