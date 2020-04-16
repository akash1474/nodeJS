const fs = require('fs');
const express = require('express');

const app = express();
const router = express.Router();
router.param('id', (req, res, next, val) => {
  console.log(`The id is ${val}`);
  next();
});
/*
delete 204
add 201
update 200
get 200
not found 404
*/
app.use(express.json());
app.use((req, res, next) => {
  req.email = 'panditakash38@gmail.com';
  req.requestedAt = new Date().toISOString();
  next();
});
const products = fs.readFileSync(`${__dirname}/data/data.json`);
const productsObj = JSON.parse(products);
const getAllProducts = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    results: productsObj.length,
    data: {
      productsObj,
    },
  });
};

const getProduct = (req, res) => {
  if (req.params.id * 1 > productsObj.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  const tosend = productsObj.find((el) => el.id === req.params.id * 1);
  res.status(200).json({
    status: 'success',
    email: req.email,
    data: {
      tour: tosend,
    },
  });
};

const addNewProduct = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'No data was provided to post',
    });
  }
  const toAdd = {
    id: productsObj[productsObj.length - 1].id * 1 + 1,
    ...req.body,
  };
  productsObj.push(toAdd);
  fs.writeFile(
    `${__dirname}/data/data.json`,
    JSON.stringify(productsObj),
    () => {
      res.status(201).json({
        status: 'success',
        data: toAdd,
      });
    }
  );
};

const updateProduct = (req, res) => {
  if (req.params.id * 1 > productsObj.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Your data was updated',
  });
};

const deleteProduct = (req, res) => {
  console.log(req.params.id * 1);
  if (req.params.id * 1 > productsObj.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  const index = productsObj.findIndex((el) => el.id === req.params.id * 1);
  productsObj.splice(index, 1);
  fs.writeFile(
    `${__dirname}/data/data.json`,
    JSON.stringify(productsObj),
    () => {
      res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: 'Requested data was deleted',
      });
    }
  );
};
app.use('/api/v1/products', router);
router.route('/').get(getAllProducts).post(addNewProduct);
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);
// app.get('/api/v1/products', getAllProducts);
// app.post('/api/v1/products', addNewProduct);
// app.get('/api/v1/products/:id', getProduct);
// app.patch('/api/v1/products/:id', updateProduct);
// app.delete('/api/v1/products/:id', deleteProduct);
app.listen(3000, 'localhost', () => {
  console.log('Server started at port 3000');
});
