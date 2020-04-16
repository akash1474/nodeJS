const express = require('express');

const app = express();
const router = require('./routes');

//GETTING THE JSON RESPONSE MIDDLEWARE
app.use(express.json());

//DEFINING THE ROUTES
app.use('/api/v1/tours', router);

module.exports = app;
