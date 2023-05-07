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
      userId: req.user._id,
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
      userId: new ObjectID(req.params.userId),
    }).populate('userId', 'name ProfileImage');
    if (!conversation) {
      return {
        message: 'Conversation not found',
      };
    }
    return conversation;
  } catch (err) {
    console.log(err);
  }
};

const findConversationByTravelerId = async (req) => {
  try {
    const conversation = await Conversation.find({
      travelerId: new ObjectID(req.params.travelerId),
    }).populate({
      path: 'travelerId',
      select: 'name ProfileImage',
      populate: {
        path: 'userId',
        select: 'name ProfileImage',
      },
    });
    if (!conversation) {
      return {
        message: 'Conversation not found',
      };
    }
    return conversation;
  } catch (err) {
    console.log(err);
  }
};

const findConversationByTwoUserId = async (req) => {
  try {
    const conversation = await Conversation.findOne({
      userId: new ObjectID(req.params.firstUserId),
      travelerId: new ObjectID(req.params.secondUserId),
    })
      .populate('userId', 'name ProfileImage')
      .populate({
        path: 'travelerId',
        select: 'name ProfileImage',
        populate: {
          path: 'userId',
          select: 'name ProfileImage',
        },
      });
    if (!conversation) {
      return {
        message: 'Conversation not found',
      };
    }
    return conversation;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createConversation,
  findConversationByUserId,
  findConversationByTravelerId,
  findConversationByTwoUserId,
};
