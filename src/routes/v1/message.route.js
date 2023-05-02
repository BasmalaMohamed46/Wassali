const router = require('express').Router();
const messageController = require('../../controllers/message.controller');

// add message

router
  .route('/')
  .post(messageController.createMessage)

// get messages

router
  .route('/:conversationId')
  .get(messageController.getMessages);




module.exports = router;
