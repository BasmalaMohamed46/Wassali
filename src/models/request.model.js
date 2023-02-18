const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const requestSchema = mongoose.Schema(
  {
    state: {
      type: String,
      enum: ['processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered'],
      required: true,
      default: 'processing',
    },
    rate: {
      type: Number,
      required: true,
      trim: true,
    },
    reward: {
      type: Number,
      required: true,
      trim: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'User',
    },
    traveler: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'Traveler',
    },
    package: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'Package',
    },
    trip: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'Trip',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
