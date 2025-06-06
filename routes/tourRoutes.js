const express = require('express');

const tourController = require('../controllers/tourController');

const authController = require('../controllers/authController')

const router = express.Router();

// param middleware
// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get( tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// i have protected the route so that only logged in user can access can access it
router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect,
authController.restrictTo('admin', 'lead-guide'),
tourController.deleteTour);

module.exports = router;