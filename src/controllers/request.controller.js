const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  requestService
} = require('../services');



const createRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const request = await requestService.createRequest(id, req);
  res.status(httpStatus.CREATED).send(request);
});
// ↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓
const getRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await requestService.queryRequests(filter, options);
  res.send(result);
});

const getRequest = catchAsync(async (req, res) => {
  const request = await requestService.getRequestById(req.params.requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  res.send(request);
});

const updateRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const request = await requestService.updateRequestById(id, req);
  res.send(request);
});

const deleteRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const request= await requestService.deleteRequestById(id, req);
  res.status(httpStatus.OK).send(request);
});

const sendRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const tripId = req.params.tripId;
  const request = await requestService.sendrequest(id, tripId, req);
  res.status(httpStatus.CREATED).send(request);
});

const userViewRequests = catchAsync(async (req, res) => {
  const id = req.user._id;
  const request = await requestService.userviewrequests(id, req);
  res.status(httpStatus.OK).send(request);
});

const userViewRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const request = await requestService.userviewrequest(id, req);
  res.status(httpStatus.CREATED).send(request);
});

const acceptRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const requestId = req.params.requestId
  const request = await requestService.acceptrequest(id, requestId, req);
  res.status(httpStatus.CREATED).send(request);
})


const declineRequest = catchAsync(async (req, res) => {
  const id = req.user._id;
  const requestId = req.params.requestId;
  const request = await requestService.declinerequest(id, requestId, req);
  res.status(httpStatus.CREATED).send(request);
})

const viewAllRequest = catchAsync(async (req, res) => {

    const request = await requestService.viewAllRequests(req);
    res.status(httpStatus.CREATED).send(request);
  })
  const DeclineTrip = catchAsync(async (req, res) => {
    const id = req.user._id;
    const request = await requestService.DeclineTrip(id,req,res);
    return(request)
  })
  //traveler see a request and accept it and send to user a request that appear in a list of requests
  const TravelerAcceptRequest = catchAsync(async (req, res) => {
    const id = req.user._id;
    const request = await requestService.TravelerAcceptRequest(id,req,res);
    return(request)
  })

  const userAcceptTravelerRequest = catchAsync(async (req, res)=>{
    const id = req.user._id;
    const request = await requestService.userAcceptTravelerRequest(id,req,res);
    return(request)
  })


  const viewTravelersRequests =  catchAsync(async (req, res)=>{
    const id = req.user._id;
    const request = await requestService.viewTravelersRequests(id,req,res);
    return(request)
  });

  const viewRequestAfterAcceptance =  catchAsync(async (req, res)=>{
    const id = req.user._id;
    const request = await requestService.viewRequestAfterAcceptance(id,req,res);
    return(request)
  });
  const ViewAllAcceptedRequests =  catchAsync(async (req, res)=>{
    const id = req.user._id;
    const requests = await requestService.ViewAllAcceptedRequests(id,req,res);
    return(requests)
  });

  const checkoutSession = catchAsync(async (req, res)=>{
    const id = req.user._id;
    const session = await requestService.checkout(id, req, res);
    return session;
  })

  const checkoutSessionWithPrice = catchAsync(async (req, res)=>{
    const id = req.user._id;
    const session = await requestService.checkoutWithPrice(id, req, res);
    return session;
  })

  const filterRequestsByCity = catchAsync(async (req, res)=>{
    const requestsSearch = await requestService.filterRequestsByCity(req, res);
    res.status(httpStatus.OK).send(requestsSearch);
  });

  const getAceeptedRequests = catchAsync(async (req, res)=>{
    const getAceeptedRequests = await requestService.getAceeptedRequests(req, res);
    res.status(httpStatus.OK).send(getAceeptedRequests);
  });

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  sendRequest,
  userViewRequests,
  userViewRequest,
  acceptRequest,
  declineRequest,
  viewAllRequest,
  DeclineTrip,
  TravelerAcceptRequest,
  userAcceptTravelerRequest,
  viewTravelersRequests,
  viewRequestAfterAcceptance,
  ViewAllAcceptedRequests,
  checkoutSession,
  checkoutSessionWithPrice,
  filterRequestsByCity,
  getAceeptedRequests
};
