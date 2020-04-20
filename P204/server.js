const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connectin Successfull!!!');
  })
  .catch((err) => console.log(err));

const server = app.listen(3000, 'localhost', () => {
  console.log('Server Started at PORT:3000');
});

//Unhandled Rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED ERROR!!! Shutting Down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
