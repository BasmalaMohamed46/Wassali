const express = require('express');
const validate = require('../../middlewares/validate');
const requestValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(requestValidation.createRequest), requestController.createRequest)
  .get(auth(), validate(requestValidation.getRequests), requestController.getRequests);

router
  .route('/:requestId')
  .get(auth(), validate(requestValidation.getRequest), requestController.getRequest)
  .patch(auth(), validate(requestValidation.updateRequest), requestController.updateRequest)
  .delete(auth(), validate(requestValidation.deleteRequest), requestController.deleteRequest);

module.exports = router;
