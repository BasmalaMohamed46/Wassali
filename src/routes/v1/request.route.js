const express = require('express');
const validate = require('../../middlewares/validate');
const requestValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.get('/SearchByCity',auth(), requestController.filterRequestsByCity);
router.get('/getAceeptedRequest',auth(), requestController.getAceeptedRequests);
router.post('/declinetrip/:requestId',auth(),requestController.DeclineTrip)
router.get('/userviewrequests',auth(),requestController.userViewRequests)
router.get('/userviewrequest/:requestId',auth(),requestController.userViewRequest)
router.get('/viewAllRequests' , auth() ,requestController.viewAllRequest);
router.post('/TravelerAcceptRequest/:requestId',auth(),requestController.TravelerAcceptRequest)
router.post('/userAcceptTravelerRequest/:tripId',auth(),requestController.userAcceptTravelerRequest)
router.get('/viewTravelersRequests',auth(),requestController.viewTravelersRequests)
router.get('/viewRequestAfterAcceptance/:requestId',auth(),requestController.viewRequestAfterAcceptance)
router.get('/ViewAllAcceptedRequests',auth(),requestController.ViewAllAcceptedRequests)

router.post('/createCheckoutSession',auth(),requestController.checkoutSession)
router.post('/createCheckoutSessionWithPrice',auth(),requestController.checkoutSessionWithPrice)



router
  .route('/')
  .post(validate(requestValidation.createRequest),auth() ,requestController.createRequest)
  .get(validate(requestValidation.getRequests), requestController.getRequests);

router
  .route('/:requestId')
  .get(validate(requestValidation.getRequest), requestController.getRequest)
  .patch(validate(requestValidation.updateRequest),auth() ,requestController.updateRequest)
  .delete(validate(requestValidation.deleteRequest),auth(), requestController.deleteRequest);


router.post('/sendrequest/:tripId',validate(requestValidation.sendRequest),auth(),requestController.sendRequest)

router.post('/acceptrequest/:requestId', auth(), requestController.acceptRequest)
// router.post('/acceptanyrequest/:requestId', auth(), requestController.acceptAnyRequest)
router.post('/declinerequest/:requestId', auth(), requestController.declineRequest)
module.exports = router;
