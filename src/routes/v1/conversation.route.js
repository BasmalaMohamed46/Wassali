const router = require('express').Router();
const conversationController = require('../../controllers/conversation.controller');

// new conv

// router
//   .route('/')
//   .post(conversationController.createConversation)

// get conversation of a user
router.get('/:userId', conversationController.findConversationByUserId);

// get conversation includes two userId
router.get('/find/:firstUserId/:secondUserId', conversationController.findConversationByTwoUserId);


//get conversation by id
router.get('/find/:id', conversationController.findConversationById);

module.exports = router;
