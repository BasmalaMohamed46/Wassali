const express = require('express');
const tripController = require('../../controllers/trip.controller');
const validate = require('../../middlewares/validate');
const tripValidation = require('../../validations/trip.validation');


const auth = require('../../middlewares/auth');

const router = express.Router();

router.post(
    '/add',
    auth(),
    validate(tripValidation.createTrip),
    tripController.CreateTrip
    );
    

router.delete(
  '/delete/:tripId',
  auth(),
  tripController.deleteTrip
);

module.exports = router;
