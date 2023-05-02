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
  // [
  //   check('NationalId')
  //   .not()
  //   .isEmpty()
  //   .withMessage('NationalId is required')
  //   .isLength({
  //     min: 16,
  //     max: 16
  //   })
  //   .withMessage('NationalId must be 16 digit'),
  //   check('city').not().isEmpty().withMessage('City field is required'),
  //   check('birthdate')
  //   .not()
  //   .isEmpty()
  //   .withMessage('BirthDay field is required')
  //   .isISO8601()
  //   .withMessage('Date format is YYYY-MM-DD')
  //   .isBefore('2003-01-01')
  //   .withMessage('Age must be 18+'),
  //   check('government', 'government field is required').not().isEmpty(),
  // ],
  // (req, res, next) => {
  //   const validationErrors = validationResult(req);
  //   if (!validationErrors.isEmpty()) {
  //     // console.log(req.files.StudentUniversityId);
  //     console.log(req.files.StudentUniversityId[0].filename);
  //     if (req.files) {
  //       if (req.files.StudentUniversityId) {
  //         fs.unlink(`./uploads/Traveler/StudentUniversityId/${req.files.StudentUniversityId[0].filename}`, (err) => {
  //           if (err) {
  //             console.log(err)
  //           }
  //         })
  //       }
  //       if (req.files.CollegeEnrollmentStatement) {
  //         fs.unlink(`./uploads/Traveler/CollegeEnrollmentStatement/${req.files.CollegeEnrollmentStatement[0].filename}`, (err) => {
  //           if (err) {
  //             console.log(err)
  //           }
  //         })
  //       }
  //       if (req.files.EmployeeCompanyId) {
  //         fs.unlink(`./uploads/Traveler/EmployeeCompanyId/${req.files.EmployeeCompanyId[0].filename}`, (err) => {
  //           if (err) {
  //             console.log(err)
  //           }
  //         })
  //       }
  //       if (req.files.EmployeeCompanyId) {
  //         fs.unlink(`./uploads/Traveler/NationalIdCard/${req.files.NationalIdCard[0].filename}`, (err) => {
  //           if (err) {
  //             console.log(err)
  //           }
  //         })
  //       }
  //     }
  //     return res.status(422).json({
  //       errors: validationErrors.array()
  //     });
  //   } else {
  //     next();
  //   }
  // },
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

// router.delete(
//   '/delete',
//   auth(),
//   travelerController.deleteTraveller
// );

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

  '/AddRating/:travelerId',
  auth(),
  travelerController.AddRating
)
router.get(
  '/ViewRating/:travelerId',
  auth(),
  travelerController.ViewRating
)
router.post(
  '/TravelerOnHisWay/:requestId',
  auth(),
  travelerController.TravelerOnHisWay
)

module.exports = router;
