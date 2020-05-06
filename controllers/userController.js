const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

//Here cb =>Callback fn
//filename=> user-userId-currentTimeStamp.extension
//req.file
// {
//   fieldname: 'photo',
//   originalname: 'leo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg', //is availabe as file in  configuration
//   destination: 'public/img/users',
//   filename: '29b520f26f37494595238db7661b7c75',
//   path: 'public\\img\\users\\29b520f26f37494595238db7661b7c75',
//   size: 207078
// }

//The first argument of cb(callBack function ) is an error and second
//is what to do ie if first error then sencond true
// const multerStorage = multer.diskStorage({
//   //Defining the destination
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   //Configuring the file name
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });

//Storing the file as a buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  //Allowing only the files that are images
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `The uploaded file is not an image!! Please upload an image file`,
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  //Setting this because req.file.filename is not availabe but we require it while save the filename to the database
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = handlerFactory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const user = await User.find();
//   res.status(500).json({
//     status: 'success',
//     data: user,
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  //1]CREATE ERROR IF THE USER POSTS PASSWORD DATA
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update please use /updateMyPassword',
        400
      )
    );
  }
  //2]UPDATE USER DOCUMENT
  const filterBody = filterObj(req.body, 'name', 'email');
  //Saving the filename in the database by checking if there is req.file
  if (req.file) filterBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = handlerFactory.getOne(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined. Please user /signUp instead',
  });
};

//DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = handlerFactory.updateOne(User);
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

exports.deleteUser = handlerFactory.deleteOne(User);
