const { boolean } = require('joi');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const requestSchema = mongoose.Schema(
  {
    state: {
      type: String,
      enum: ['processing', 'accepted', 'pickedup', 'onmyway', 'delivered'],
      default: 'processing',
    },
    rate: {
      type: Number,
      // required: true,
      trim: true,
    },
    reward: {
      type: Number,
      // required: true,
      trim: true,
    },
    qrCode: {
      type: String,
      // required: true,
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
    trip: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'Trip',
    },
    conversation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    }],
    to:{
      type: String,
      required: true,
    },
    from:{
      type: String,
      required: true,
    },
    item:{
      type: String,
      required: true,
    },
    weight:{
      type: Number,
      // required: true,
    },
    location:{
      type: String,
      required: true,
    },
    targetLocation:{
      type: String,
      // required: true,
    },
    anotherPhone:{
      type: String,
      // required: true,
    },
    category:{
      type: String,
      required: true,
    },
    buyOrdeliver:{
    type:String,
    enum:['buy','deliver'],
    },
    date:{
      type:Date,
      required:true,
    },
    storeLocation:{
      type:String,
    },
    storeName:{
      type:String,
    },
    price:{
      type:Number,
    },
    tripsRequests:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    TripOfferedPrice:[{
      trip:{
        type: Schema.Types.ObjectId,
        ref: 'Trip',

      },
      price:{
        type:Number,
      },
    }],
    tripPrice:{
      type:Number,
    }
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
