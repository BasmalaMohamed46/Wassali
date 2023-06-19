const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const adminController = require('../../controllers/admin.controller');
const adminService = require('../../services/admin.service');
const router = express.Router();

router.post('/register', validate(authValidation.register), adminController.register);
router.post('/login', validate(authValidation.login), adminController.login);
router.delete('/deleteUser/:userId', auth(), adminController.deleteUser);
router.put('/updateUser/:userId', auth(), adminController.updateUser);
router.get('/getAllUsers', auth(), adminController.getAllUsers);
router.get('/getUser/:userId', auth(), adminController.getUser);

//Traveler
router.get('/getAllTravelers', auth(), adminController.getAllTravelers);
router.delete('/deleteTraveler/:travelerId', auth(), adminController.deleteTraveler);
router.put('/updateTraveler/:travelerId', auth(), adminController.updateTraveler);
router.get('/getTraveler/:travelerId', auth(), adminController.getTraveler);

//request
router.get('/getRequest/:requestId', auth(), adminController.getRequest);
router.get('/getRequests', auth(), adminController.getRequests);
router.delete('/deleteRequest/:requestId', auth(), adminController.deleteRequest);

//trip
router.get('/getTrip/:tripId', auth(), adminController.getTrip);
router.get('/getTrips', auth(), adminController.getAllTrips);
router.delete('/deleteTrip/:tripId', auth(), adminController.deleteTrip);

//verify documents
router.patch('/verifyDocuments/:travelerId', auth(), adminController.verifyDocuments);

module.exports = router;
