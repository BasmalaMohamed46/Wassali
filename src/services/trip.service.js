const httpStatus = require('http-status');
const Trip = require('../models/trip.model');
const Traveler = require('../models/traveler.model');
const User = require('../models/user.model');

const addTrip = async (id, req) => {
  try {
    const userExist = await User.findById(id)
    if (userExist){
    let foundedTraveler = await Traveler.findOne({userId:id});
    const {TripDestination,TripDate,AvailableWeight,unAcceptablaPackage,TripTime} = req.body;
    if(foundedTraveler){
        const trip = await Trip.insertMany({TripDestination,TripDate,AvailableWeight,unAcceptablaPackage,Traveler:foundedTraveler._id,TripTime});
        foundedTraveler =  await Traveler.findByIdAndUpdate({_id:foundedTraveler._id},{$push:{Trip:trip[0]._id}},{new:true});
        return {
            message: 'Trip added successfully',
            trip
        }}
    else{
        return {
          message: 'Trip not added',
    }}}
    else{
        return {
            message: 'User not found',      
}}
}
      catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    }
  }
};

const deleteTrip = async (id,res,tripId) => {
    try{
        let foundedTraveler = await Traveler.findOne({userId:id});
    if(foundedTraveler){
        const foundedTrip = await Trip.findById(tripId);
        if(foundedTrip){
            if(foundedTrip.Traveler.toString() == foundedTraveler._id.toString()){
               const trip=await Trip.findByIdAndDelete(tripId);
                foundedTraveler =  await Traveler.findByIdAndUpdate({_id:foundedTraveler._id},{$pull:{Trip:trip._id}},{new:true});
                res.status(httpStatus.OK).json({
                    message: 'Trip deleted successfully',
                    trip
                })}
            else{
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'You are not allowed to delete this trip',
                })
            }}
        else{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Trip not found',
            })
        }}
    else{
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Traveler not found',
        })
    }}
 
  catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    })
  }

}


module.exports = {
    addTrip,
  deleteTrip,
 
};