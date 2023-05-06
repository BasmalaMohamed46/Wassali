const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    travelerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traveler',
      // required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
