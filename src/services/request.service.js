const httpStatus = require('http-status');
const {
  Request
} = require('../models');
const {
  User
} = require('../models');
const {
  Traveler
} = require('../models');
// const {
//   Trip
// } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a request
 * @param {Object} requestBody
 * @returns {Promise<Request>}
 */
const createRequest = async (id, req) => {
  const user = await User.findById(id)
  if (user) {
    const request = await Request.create({
      userId: id,
      ...req.body
    });
    await User.findByIdAndUpdate(id, {
      $push: {
        requests: request._id
      }
    });
    return {
      message: 'Request added successfully',
      request
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

};

/**
 * Query for requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryRequests>}
 */
const queryRequests = async (filter, options) => {
  const requests = await Request.paginate(filter, options);
  return requests;
};

/**
 * Get request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestById = async (id) => {
  return Request.findById(id);
};

/**
 * Update request by id
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @returns {Promise<Request>}
 */
const updateRequestById = async (id, req) => {
  const user = await User.findById(id)
  if (user) {
    if (user.requests.includes(req.params.requestId)) {
      const request = await Request.findByIdAndUpdate(req.params.requestId, req.body, {
        new: true
      })
      return {
        message: 'Request updated successfully',
        request
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to update this request');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

};

/**
 * Delete request by id
 * @param {ObjectId} requestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (id, req) => {
  const userExist = await User.findById(id);
  if (userExist) {
    if (userExist.requests.includes(req.params.requestId)) {
      const request = await Request.findById(req.params.requestId)
      if (request.state == 'accepted' || request.state == 'pickedup' || request.state == 'onmyway' || request.state == 'delivered') {
        return {
          message: 'Sorry, you can not delete this request'
        }
      } else {
        if(request.trip){
          const tripId = request.trip;
            const trip = await Trip.findById(tripId)
            // console.log(trip.RequestsList);
            await Request.findByIdAndDelete(req.params.requestId)
            await User.findByIdAndUpdate(id, {
              $pull: {
                requests: req.params.requestId
              }
            });
            await Trip.findByIdAndUpdate(tripId, {
              $pull: {
                RequestsList: req.params.requestId
              }
            })
          return {
            message: 'Request deleted successfully',
            request
          }
        }
        else{
          await Request.findByIdAndDelete(req.params.requestId);
          await User.findByIdAndUpdate(id, {
            $pull: {
              requests: req.params.requestId
            }
          });
          return {
            message: 'Request deleted successfully',
            request
          }
        }
      }
    } else {
      return {
        message: 'you are not allowed to delete this request'
      }
    }
  } else {
    return {
      message: 'user not found'
    }
  }
};
const sendrequest = async (id, tripId, req) => {
  const user = await User.findById(id)
  if (user) {
    const trip = await Trip.findById(req.params.tripId)
    if (trip) {
      const request = await Request.create({
        userId: id,
        trip: tripId,
        ...req.body
      });
      await User.findByIdAndUpdate(id, {
        $push: {
          requests: request._id
        }
      });
      await Trip.findByIdAndUpdate(tripId, {
        $push: {
          RequestsList: request._id
        }
      });
      return {
        message: 'Request added successfully',
        request
      }
    } else {
      return {
        message: 'Trip not found'
      }
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
}

const userviewrequests = async (id, req) => {
  const user = await User.findById(id)
  if (user) {

    const requests = await Request.find({
      userId: id
    })
    return {
      message: 'Requests found successfully',
      requests
    }

  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

}

const userviewrequest = async (id, req) => {
  const user = await User.findById(id)
  if (user) {
    if (user.requests.includes(req.params.requestId)) {
      const request = await Request.findById(req.params.requestId)
      return {
        message: 'Request found successfully',
        request
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to view this request');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

// accept specific request
const acceptrequest = async (id, requestId, req) => {
  const TravelerExist = await Traveler.findOne({
    userId: id
  })
  if (TravelerExist) {
    const request = await Request.findById(req.params.requestId)
    const tripId = request.trip;
    console.log(tripId);
    const trip = await Trip.findById(tripId);
    if (trip) {
      if (trip.AcceptedRequests.includes(requestId)) {
        return {
          message: 'Request already accepted'
        }
      }
      await Trip.findByIdAndUpdate(
        tripId, {
          $push: {
            AcceptedRequests: requestId
          },
          $pull: {
            RequestsList: requestId
          }
        }
      )
      await Request.findByIdAndUpdate(
        requestId, {
          $set: {
            state: 'accepted'
          }
        }
      )
      return {
        message: 'Request accepted successfully'
      }
    } else {
      return {
        message: 'Trip not found'
      }
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'traveler not found');
  }
}

//accept any request
// const acceptanyrequest = async (id, requestId, req) => {
//   const TravelerExist = await Traveler.findOne({
//     userId: id
//   })
//   if (TravelerExist) {
//     const request = await Request.findById(req.params.requestId);
//     if (request) {
//       const tripId = TravelerExist.Trip.slice(-1);
//       const trip = await Trip.findById(tripId);
//       if (trip.AcceptedRequests.includes(requestId)) {
//         return {
//           message: 'Request already accepted'
//         }
//       }
//       await Trip.findByIdAndUpdate(tripId, {
//         $push: {
//           AcceptedRequests: requestId
//         },

//       }, {
//         new: true
//       })
//       await Request.findByIdAndUpdate(requestId, {
//         $set: {
//           state: 'accepted'
//         },
//         trip: tripId
//       }, {
//         new: true
//       })
//       return {
//         message: 'Request accepted successfully'
//       }
//     } else {
//       return {
//         message: 'Request not found'
//       }
//     }
//   } else {
//     return {
//       message: 'Traveler not found'
//     }
//   }
// }
const declinerequest = async (id, requestId, req) => {
  // let requestId = req.params.requestId;
  const TravelerExist = await Traveler.findOne({
    userId: id
  })
  if (TravelerExist) {
    const request = await Request.findById(req.params.requestId)
    const tripId = request.trip;
    console.log(tripId);
    const trip = await Trip.findById(tripId);
    if (trip) {
      await Trip.findByIdAndUpdate(
        tripId, {
          $pull: {
            RequestsList: requestId
          }
        }
      )
      await Request.findByIdAndUpdate(req.params.requestId, {
        trip: null
      }, {
        new: true
      })
      return {
        message: 'Request declined successfully'
      }
    } else {
      return {
        message: 'Trip not found'
      }
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Traveler not found');
  }
}




const viewAllRequests = async (req) => {
  const requests = await Request.find();

  return {
    message: 'Requests found successfully',
    requests
  }
}
const DeclineTrip=async (id,req,res)=>{
  try{
    const user=await User.findById(id)
    if(user){
      if (user.requests.includes(req.params.requestId)) {
        const request = await Request.findById(req.params.requestId)
       if(request.state === 'accepted') {
          request.state='processing';
          const tripId = request.trip;
          const trip = await Trip.findById(tripId);
          if (trip) {
            await Trip.findByIdAndUpdate(
              tripId, {
                $pull: {
                  AcceptedRequests:req.params.requestId
                }
              }
            )
          }
          console.log(req.params.requestId)
          request.trip=null;
          await request.save();
          res.status(200).json({message:'request declined successfully'})
       }
        else{
          res.status(200).json({message:'this request is not accepted yet'})
        }
      }
      else{
        throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to edit this request');
      }
    }
    else{
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  }
  catch(err){
    res.status(500).json({message:err.message})
  }
}
const TravelerAcceptRequest=async (id,req,res)=>{
  try{
    const user=await User.findById(id)
    if(user){
      const traveler=await Traveler.find({userId:id})
      if(traveler){
        const request = await Request.findById(req.params.requestId)
        if(request.state === 'accepted') {
          res.status(200).json({message:'this request is already accepted'})
        }
        else{
        const tripId=traveler[0].Trip.slice(-1)[0];
        console.log(tripId)
        if(!request.tripsRequests.includes(tripId)){
        await Request.findByIdAndUpdate(req.params.requestId, {
        $push: {
          tripsRequests: tripId,
          TripOfferedPrice:{
            trip:tripId,
            price:req.body.price
          }
        },
      }, {
        new: true
      })
      res.status(200).json({message:'request added'})
        }
        else{
          res.status(200).json({message:'request already added'})
        }
      }
    }
      else{
        throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to accept this request');
      }
    }
    else{
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  }
  catch(err){
    res.status(500).json({message:err.message})
  }
}

module.exports = {
  createRequest,
  queryRequests,
  getRequestById,
  updateRequestById,
  deleteRequestById,
  sendrequest,
  userviewrequests,
  userviewrequest,
  acceptrequest,
  // acceptanyrequest,
  declinerequest,
  viewAllRequests,
  DeclineTrip,
  TravelerAcceptRequest
};
