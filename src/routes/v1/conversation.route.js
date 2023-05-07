const router = require('express').Router();
const conversationController = require('../../controllers/conversation.controller');

// new conv

// router
//   .route('/')
//   .post(conversationController.createConversation)

// get conversation of a user
router.get('/:userId', conversationController.findConversationByUserId);

// get conversation of a traveler
router.get('/traveler/:travelerId', conversationController.findConversationByTravelerId);

// get conversation includes two userId
router.get('/find/:firstUserId/:secondUserId', conversationController.findConversationByTwoUserId);

//get conversation by id
router.get('/find/:conversationId', conversationController.findConversationById);

module.exports = router;
