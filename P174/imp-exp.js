const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./models/tourModel');

dotenv.config({ path: './config.env' });
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
  })
  .catch((err) => console.log(err));

const data = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

const importData = async () => {
  try {
    console.log('here');
    await Tour.create(data);
    console.log('Data import successfull!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deletion successfull!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
