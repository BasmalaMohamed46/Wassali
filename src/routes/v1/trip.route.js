const express = require('express');
const tripController = require('../../controllers/trip.controller');
const validate = require('../../middlewares/validate');
const tripValidation = require('../../validations/trip.validation');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add', auth(), validate(tripValidation.createTrip), tripController.CreateTrip);

router.delete('/delete/:tripId', auth(), tripController.deleteTrip);

router.get('/view', auth(), tripController.ViewTrips);

router.get('/viewtravelertrips', auth(), tripController.ViewTravelerTrips);

router.get('/viewtrip/:tripId', auth(), tripController.ViewTrip);

router.put('/update/:tripId', auth(), validate(tripValidation.updateTrip), tripController.updateTrip);
router.get('/TripSearchByCity', auth(), tripController.filterTripsByCity);

module.exports = router;
