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

const viewtrips = async (id, req,res) => {
  try{
    const user=await User.findById(id);
    if(user){
    const trips=await Trip.find();
    if(trips.length>0){
      res.status(httpStatus.OK).json({
        message: 'Trips found successfully',
        trips
      })}
    else{
      res.status(httpStatus.OK).json({
        message: 'No Trips founded',
      })
    }
  }
  else{
    res.status(httpStatus.NOT_FOUND).json({
      message: 'You are not allowed to view trips',
    })
}
   }
  catch(err){
    return {
      message: 'Something went wrong',
      err: error.message,
    }

  }
}

const viewtravelertrips = async (id, req,res) => {
  try{
    const traveler=await Traveler.findOne({userId:id});
    if(traveler){
    const trips=await Trip.find({Traveler:traveler._id});
    if(trips.length>0){
      res.status(httpStatus.OK).json({
        message: 'Trips found successfully',
        trips
      })}
    else{
      res.status(httpStatus.OK).json({
        message: 'No Trips founded',
      })
    }
  }
  else{
    res.status(httpStatus.NOT_FOUND).json({
      message: 'You are not allowed to view trips',
    })

  }
}
  catch(err){
    return {
      message: 'Something went wrong',
      err: error.message,
    }

  }

}

const viewtrip = async (id, req,res,tripId) => {
  try{
    const user=await User.findById(id);
    if(user){
      const trip=await Trip.findById(tripId);
      if(trip){
        res.status(httpStatus.OK).json({
          message: 'Trip found successfully',
          trip
        })
      }
      else{
        res.status(httpStatus.NOT_FOUND).json({
          message: 'Trip not found',
        })
      }
    }
    else{
      res.status(httpStatus.NOT_FOUND).json({
        message: 'You are not allowed to view trips',
      })
    }

  }
  catch(err){
    return {
      message: 'Something went wrong',
      err: error.message,
    }

  }
}

const updateTrip = async (id, req, res, tripId) => {
  try {
    const userExist = await User.findById(id)
    if (userExist) {
      let foundedTraveler = await Traveler.findOne({
        userId: id
      });
      const {
        TripDestination,
        TripDate,
        AvailableWeight,
        unAcceptablaPackage,
        TripTime
      } = req.body;
      if (foundedTraveler) {
        const trip = await Trip.findByIdAndUpdate({
          _id: tripId
        }, {
          TripDestination,
          TripDate,
          AvailableWeight,
          unAcceptablaPackage,
          Traveler: foundedTraveler._id,
          TripTime
        }, {
          new: true
        });
        return {
          message: 'Trip updated successfully',
          trip
        }
      } else {
        res.status(404).json({
          message: 'Traveler not found',
        })
      }
    } else {
      res.status(404).json({
        message: 'User not found',
      })
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: err.message,
    })
  }
};



module.exports = {
  addTrip,
  deleteTrip,
  viewtrips,
  viewtravelertrips,
  viewtrip,
  updateTrip
};
