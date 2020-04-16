const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./practice-model');

console.log(User);
//Read JSON file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8')
);

dotenv.config({ path: './config.env' });
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

console.log(process.argv);
//Import data info database
const ImportData = async () => {
  try {
    await User.create(users);
    console.log('Data successfully loaded!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete all data fom the tours collection
const deleteData = async () => {
  try {
    await User.deleteMany();
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
