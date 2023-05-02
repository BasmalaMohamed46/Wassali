const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Message = require('../models/Message');



const createMessage = async (req) => {
    const newMessage = new Message(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (err) {
        throw new ApiError(httpStatus.NOT_FOUND, 'please type a message', err);
    }
  };


  const getMessages = async (req) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      if(messages.length ==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No messages found in this conversation');
      }
      return messages;
    } catch (err) {
        throw new ApiError(err);
    }
  };

  module.exports = {
    createMessage,
    getMessages
};