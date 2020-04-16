const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNHANDLED EXCEPTION SHUTTING DOWN!!!');
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connection Established');
  })
  .catch((err) => {
    console.log(err);
  });

console.log(process.env.PORT);
const server = app.listen(3000, 'localhost', () => {
  console.log('Server started!!');
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLED REJECTION SHUTTING DOWN!!!');
  server.close(() => {
    process.exit(1);
  });
});
