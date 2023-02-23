const express = require('express');
const validate = require('../../middlewares/validate');
const requestValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(validate(requestValidation.createRequest), requestController.createRequest)
  .get(validate(requestValidation.getRequests), requestController.getRequests);

router
  .route('/:requestId')
  .get(validate(requestValidation.getRequest), requestController.getRequest)
  .patch(validate(requestValidation.updateRequest), requestController.updateRequest)
  .delete(validate(requestValidation.deleteRequest), requestController.deleteRequest);

module.exports = router;
