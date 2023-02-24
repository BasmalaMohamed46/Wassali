const mongoose = require('mongoose');


const tripSchema = mongoose.Schema({
  TripDestination: {
    type: String,
    required:true
  },
  TripDate: {
    type: Date,
    required:true
  },
  TripTime:{
    type: String,
    required:true
  },
  AvailableWeight: {
    type: Number,
    required:true
  },
  unAcceptablaPackage:{
    type:String,
    required:true
  },
  Traveler:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Traveler',
    required: true,
    },
  Request:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Request',
    }],
}, {
  timestamps: true,
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
