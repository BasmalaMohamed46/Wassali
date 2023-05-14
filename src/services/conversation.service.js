const httpStatus = require('http-status');
const { Request } = require('../models');
const ApiError = require('../utils/ApiError');
const Conversation = require('../models/Conversation');
const ObjectID = require('mongodb').ObjectID;

/**
 * Create a conversation
 * @param {Object} conversationBody
 * @returns {Promise<Conversation>}
 */
const createConversation = async (requestId, req) => {
  if (requestId) {
    const conversation = await Conversation.create({
      members: [req.user._id],
    });
    await Request.findByIdAndUpdate(requestId, {
      $push: {
        conversation: conversation._id,
      },
    });
    return {
      message: 'Conversation added successfully',
      conversation,
    };
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
};
const findConversationByUserId = async (req) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [new ObjectID(req.params.userId)] },
    });
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    return conversation;
  } catch (err) {
    console.error(err);
  }
};

const findConversationByTwoUserId = async (req) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [new ObjectID(req.params.firstUserId), new ObjectID(req.params.secondUserId)] },
    });
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    return conversation;
  } catch (err) {
    console.error(err);
  }
};


const findConversationById = async(req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    return conversation;
    };


module.exports = {
  createConversation,
  findConversationByUserId,
  findConversationByTwoUserId,
  findConversationById
};
