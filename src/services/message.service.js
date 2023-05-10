const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const createMessage = async (req) => {
    const newMessage = new Message(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (err) {
      return {
        message: "please enter a message"
      };
    }
  };


  const getMessages = async (req) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      if(messages.length ==0) {
       
      throw new ApiError(httpStatus.NOT_FOUND, 'no messages found');
         
        
      }
      return messages;
    } catch (err) {
      console.log(err);
    }
  };

  module.exports = {
    createMessage,
    getMessages
};