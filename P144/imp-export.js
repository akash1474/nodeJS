const mongoose = require('mongoose');
const express = require('express');

const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./model');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useFindAndModify: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database Connection Established');
  })
  .catch((err) => {
    console.log(err);
  });

const info = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(info);
    console.log('Data Import Successfull');
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Database Deletion successfull');
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
app.listen(300, 'localhost', () => {
  console.log('Server Started');
});
