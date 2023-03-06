const httpStatus = require('http-status');
const { Request } = require('../models');
const { User } = require('../models');
const { Trip } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a request
 * @param {Object} requestBody
 * @returns {Promise<Request>}
 */
const createRequest = async (id,req) => {
  const user=await User.findById(id)
  if(user){
  const request = await Request.create({
    userId:id,
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
}
else{
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
const updateRequestById = async (id,req) => {
  const user=await User.findById(id)
  if(user){
    if(user.requests.includes(req.params.requestId)){
      const request=await Request.findByIdAndUpdate(req.params.requestId,req.body,{new:true})
      return {
        message: 'Request updated successfully',
        request
      }
  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to update this request');
  }
}
   
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

};

/**
 * Delete request by id
 * @param {ObjectId} requestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (requestId) => {
  const request = await getRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await request.remove();
  return request;
};
const sendrequest = async (id,tripId,req) => {
  const user=await User.findById(id)
  if(user){
  const request = await Request.create({
    userId:id,
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
}
else{
  throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
}
}

const userviewrequests = async (id,req) => {
  const user=await User.findById(id)
  if(user){

    const requests=await Request.find({userId:id})
    return {
      message: 'Requests found successfully',
      requests}

  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

}

const userviewrequest = async (id,req) => {
  const user=await User.findById(id)
  if(user){
    if(user.requests.includes(req.params.requestId)){
      const request=await Request.findById(req.params.requestId)
      return {
        message: 'Request found successfully',
        request
      }
  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to view this request');
  }
}
else{
  throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
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
  userviewrequest
};
