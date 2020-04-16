const Tour = require('./model');

// GET ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    //BUILDING THE QUERY
    const queryObj = { ...req.query };

    //FILTERING
    const exFiles = ['sort', 'page', 'fields', 'limit'];
    exFiles.forEach((el) => delete queryObj[el]);

    //ADVANCED FILETERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    //SORTING
    if (req.query.sort) {
      const sortArr = req.query.sort.split(',').join(' ');
      query = query.sort(sortArr);
    } else {
      query = query.sort('-createdAt');
    }
    //FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-_id -__v');
    }
    //PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('Page does not exists');
    }

    const tours = await query;
    //SENDING RES
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
//GET TOUR
exports.getTour = async (req, res) => {
  try {
    const data = await Tour.find(req.params.id);
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
//CREATE TOUR
exports.createTour = async (req, res) => {
  try {
    const data = await Tour.findById(req.params.id);
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

//UPDATE TOURS
exports.updateTour = async (req, res) => {
  try {
    const data = await Tour.findByIdAndUpdate(req.params.id, req.body, {
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

//DELETE TOUR
exports.deleteTour = async (req, res) => {
  try {
    const data = await Tour.findByIdAndDelete(req.params.id);
    res.status(205).json({
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

//AGGREGATION PIPELINE
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      //consists of stages
      {
        $match: { ratingsAverage: { $gt: 4.5 } }, //Just a query
      },
      {
        //Allows to group the documents using accmulators
        $group: {
          _id: '$duration',
          numTours: { $sum: 1 }, //Adss 1 for each document
          numRatings: { $sum: '$ratingsQuantity' },
          tours: { $push: '$name' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $avg: '$price' },
          maxPrice: { $avg: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
