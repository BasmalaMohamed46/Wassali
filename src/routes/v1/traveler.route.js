const express = require('express');
const travelerController = require('../../controllers/traveler.controller');
const validate = require('../../middlewares/validate');
const travelerValidation = require('../../validations/traveler.validation');
const {
  check,
  validationResult
} = require('express-validator');
const {
  multerFn,
  validationType,
  multerHandelErrors
} = require('../../services/multer');
const auth = require('../../middlewares/auth');
const fs = require('fs')
const router = express.Router();

router.patch(
  '/create',
  auth(),
  multerFn('Traveler', validationType.image),
  validate(travelerValidation.createTraveler),
  travelerController.AddTraveler
);

router.patch(
  '/update',
  auth(),
  validate(travelerValidation.updateTraveler),
  multerFn('Traveler', validationType.image),
  travelerController.updateTraveller
);

router.put(
  '/student',
  auth(),
  travelerController.IsStudent)

router.patch(
  '/employee',
  auth(),
  travelerController.IsEmployee)

router.get(
  '/get',
  auth(),
  travelerController.getTraveller
);

router.get(
  '/getTravellerOwnRequests',
  auth(),
  travelerController.gettravellerOwnRequests
)

router.get(
  '/travelerViewRequestById/:requestId',
  auth(),
  travelerController.TravelerViewRequestById
)
router.get(
  '/viewAllTravelers',
  auth(),
  travelerController.viewAllTravelers
)
router.post(
  '/TravelerOnHisWay/:requestId',
  auth(),
  travelerController.TravelerOnHisWay
)
module.exports = router;
