const express = require('express');
const validate = require('../../middlewares/validate');
const requestValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.get('/userviewrequests',auth(),requestController.userViewRequests)
router.get('/userviewrequest/:requestId',auth(),requestController.userViewRequest)
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
router.post('/acceptanyrequest/:requestId/:tripId', auth(), requestController.acceptAnyRequest)
router.post('/declinerequest/:requestId', auth(), requestController.declineRequest)


module.exports = router;
