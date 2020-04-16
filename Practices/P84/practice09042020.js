const express = require('express');

const dotenv = require('dotenv');

const app = express();
const mongoose = require('mongoose');

const User = require('./practice-model');

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hii from middleware');
  next();
});
// 1]DEFINING THE PATHS
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
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //D]PAGINATION
    // const users = await query;

    const users = await User.find();
    res.status(200).json({
      status: 'success',
      users,
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
      runValidators: true,
      new: true,
    });
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
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: `User with ID:${req.params.id} has been deleted`,
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
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'The new user has been added successfully',
      data: user,
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
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const router = express.Router();
app.use('/api/v2/users', router);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).delete(deleteUser).get(getUser);

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
const port = process.env.PORT;
app.listen(port, 'localhost', () => {
  console.log(`Server is running at port:${port}`);
});
