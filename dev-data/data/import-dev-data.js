/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
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

//Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data info database
const ImportData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete all data fom the tours collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully delete!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  ImportData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv); //gives info about the node and file locatoins
