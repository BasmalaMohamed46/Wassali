const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');

// const createConversation = catchAsync(async (req, res) => {
//     const conversation = await conversationService.createConversation(id, req);
//     res.status(httpStatus.CREATED).send(conversation);
//   });

const findConversationByUserId = catchAsync(async (req, res) => {
  const conversation = await conversationService.findConversationByUserId(req);
  res.status(httpStatus.OK).send(conversation);
});

const findConversationByTwoUserId = catchAsync(async (req, res) => {
  const conversation = await conversationService.findConversationByTwoUserId(req);
  res.status(httpStatus.OK).send(conversation);
});


const findConversationById = 
catchAsync(async (req, res) => {
  const conversation = await conversationService.findConversationById(req);
  res.status(httpStatus.OK).send(conversation);
  });


module.exports = {
  findConversationByUserId,
  findConversationByTwoUserId,
  findConversationById
};
