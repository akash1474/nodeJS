const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION SHUTTING DOWN....');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database connection Successfull!!!');
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT, 'localhost', () => {
  console.log('Server started at port:3000');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION shutting down');
  server.close(() => {
    process.exit(1);
  });
});
