const express = require('express');
const controller = require('./controller');

const tourRouter = express.Router();

tourRouter.route('/').get(controller.getAllTours).post(controller.createTour);
tourRouter
  .route('/:id')
  .patch(controller.updateTour)
  .delete(controller.deleteTour)
  .get(controller.getTour);

module.exports = tourRouter;
