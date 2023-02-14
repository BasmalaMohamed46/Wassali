const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema;

const requestSchema = mongoose.Schema(
    {
        // state of the request 
        state: {
            type: String,
            enum: [
                'processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered'
            ],
            required: true,
            default: 'processing',
        },
        // rate of the request and valid only numbers from 0-5
        rate: {
            type: Number,
            required: true,
            trim: true,
        },
        // reward of the request
        reward: {
            type: Number,
            required: true,
            trim: true,
        },
        // Qr code that will be stored as URI
        qrCode: {
            type: String,
            required: true
        },
        // ref to User Model
        userId: {
            type: Schema.Types.ObjectId,
            //required: true,
            ref: 'User'
        },
        // ref to Traveler Model
        traveler: {
            type: Schema.Types.ObjectId,
            //required: true,
            ref: 'Traveler'
        },
        // ref to Package Model
        package: {
            type: Schema.Types.ObjectId,
            //required: true,
            ref: 'Package'
        },
        // ref to Trip Model
        trip: {
            type: Schema.Types.ObjectId,
            //required: true,
            ref: 'Trip'
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
