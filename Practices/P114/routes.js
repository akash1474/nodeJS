const express = require('express');

const controller = require('./controller');
//CREATING THE ROUTER
const router = express.Router();
//TOUR-STATS ROUTE
router.route('/tour-stats').get(controller.getTourStats);
//DEFINING THE ROUTES
router.route('/').get(controller.getAllTours).post(controller.createTour);
//ROUTES ON ID
router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);
//EXPORTING THE ROUTES
module.exports = router;
