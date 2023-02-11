const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { states } = require('../config/requestStates');


const requestSchema = mongoose.Schema(
    {
        // state of the request 
        state: {
            type: String,
            enum: states,
            required: true,
            default: 'Processing',
        },
        // rate of the request and valid only numbers from 0-5
        rate: {
            type: Double,
            required: true,
            trim: true,
            validate(value) {
                if (!value.match(/^[0-5]{1,}$/)) {
                    throw new Error('Rate must be from 0 to 5');
                }
            },
        },
        // reward of the request and valid only numbers
        reward: {
            type: Double,
            required: true,
            trim: true,
            validate(value) {
                if (!value.match(/^[0-9]+$/)) {
                    throw new Error('Only numbers are allowed');
                }
            },
        },
        // Qr code that will be stored as URI
        qrCode: {
            type: String,
            required: true
        },
        // ref to User Model
        user: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        ],
        // ref to Traveler Model
        traveler: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Traveler'
            }
        ],
        // ref to Package Model
        package: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Package'
            }
        ],
        // ref to Trip Model
        trip: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Trip'
            }
        ]

    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
