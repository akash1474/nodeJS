/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

//eg console.log(x)
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNHANDLED ERROR!!! Shutting Down...');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// const DB = process.env.DATABASE2.replace('<PASSWORD>', process.env.PASSWORD);
const LDB = process.env.DATABASE_LOCAL;
mongoose
  .connect(LDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection established!!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, 'localhost', () => {
  console.log(`App running on port:${port}`);
});
//Unhandled Rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED ERROR!!! Shutting Down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
