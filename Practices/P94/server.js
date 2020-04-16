//IMPORT THE MODELS
const dotenv = require('dotenv');
const express = require('express');

const app = express();
const mongoose = require('mongoose');
//REQUIRE FILES
const User = require('./model');
//CREATE MIDDLE WARE
app.use(express.json());
app.param('id', (req, res, next) => {
  if (Object.keys(req.body) === null || Object.keys(req.body) === []) {
    res.status(404).json({
      status: 'fail',
      message: 'The request does not have any body',
    });
  }
  next();
});

//TOUTE FUNCTIONS
const getAllUsers = async (req, res) => {
  try {
    //BUILDING THE QUERY
    const queryObj = { ...req.query };
    //1A]FILTERING
    const exFields = ['page', 'sort', 'limit', 'fields'];
    exFields.forEach((el) => delete queryObj[el]);
    console.log(req.query);
    //1B]ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);
    let query = User.find(JSON.parse(queryStr));
    //B]SORTING
    if (req.query.sort) {
      const sortedQuery = req.query.sort.split(',').join(' ');
      query.sort(sortedQuery);
    } else {
      query.sort('name');
    }
    //C]FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //D]PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numUsers = await User.countDocuments();
      if (skip >= numUsers) throw new Error('Page does not exists');
    }
    const data = await query;
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const createUser = async (req, res) => {
  try {
    const data = await User.create(req.body);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.status(204).json({
      status: 'success',
      message: `User with the id:${req.params.id} has been deleted`,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
//DEFINE ROUTES
const router = express.Router();
app.use('/api/v2/users', router);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
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
//START THE SERVER
app.listen(process.env.PORT, 'localhost', () => {
  console.log('Server is running at port:3000');
});
