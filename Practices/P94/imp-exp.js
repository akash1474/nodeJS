//IMPORT MONGOOSE AND FS MODULES
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./model');
//IMPORT THE FILE
const people = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
//CONFIG DOTENV
dotenv.config({ path: './config.env' });
console.log(process.env.DATABASE_LOCAL);
//CREATE A MONGOOSE DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection has been established');
  });

//IMPORT AND EXPORT FUNCTIONS
const importData = async () => {
  try {
    await User.create(people);
    console.log('Data Import Successfully!!!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Deleted Successfully!!!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};
//CHECK PROCESS.ARGVS
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
