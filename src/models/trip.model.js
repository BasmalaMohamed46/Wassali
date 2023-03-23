const mongoose = require('mongoose');


const tripSchema = mongoose.Schema({
 from:{
    type: String,
    required:true
 },
  to:{
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
    //requests sent to this trip but not accepted yet
  RequestsList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Request',
    }],
    //
  AcceptedRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Request',
    }],
}, {
  timestamps: true,
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
