const express = require('express');
const requestController = require('../../controllers/request.controller');

const router = express.Router();

router
  .route('/')
  .post(requestController.createRequest)
  .get(requestController.getRequests);

router
  .route('/:requestId')
  .get(requestController.getRequest)
  .patch(requestController.updateRequest)
  .delete(requestController.deleteRequest);

module.exports = router;

