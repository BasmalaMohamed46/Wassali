const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { travelerService, requestService } = require('../services');

const IsStudent = catchAsync(async (req, res) => {
  const id = req.user._id;
  const student = await travelerService.Student(id, res);
  res.send(student);
});

const IsEmployee = catchAsync(async (req, res) => {
  const id = req.user._id;
  const employee = await travelerService.Employee(id, res);
  res.status(httpStatus.OK).send(employee);
});

const AddTraveler = catchAsync(async (req, res) => {
  const id = req.user._id;
  const addTraveler = await travelerService.createTraveler(id, req, res);
  res.status(httpStatus.CREATED).send(addTraveler);
});

const updateTraveller = catchAsync(async (req, res) => {
  const id = req.user._id;
  const update = await travelerService.updateTraveler(id, req);
  res.status(httpStatus.OK).send(update);
});
// const deleteTraveller = catchAsync(async (req, res) => {
//   const id = req.user._id;
//   const deleted = await travelerService.deleteTraveler(id,res);
//   res.status(httpStatus.OK).send(deleted);
// });
const getTraveller = catchAsync(async (req, res) => {
  const id = req.user._id;
  const traveler = await travelerService.viewTraveler(id, res);
  return traveler;
});

const gettravellerOwnRequests = catchAsync(async (req, res) => {
  const id = req.user._id;
  const requests = await travelerService.getTravellerOwnRequests(id, res);
  return requests;
});

const TravelerViewRequestById = catchAsync(async (req, res) => {
  const id = req.user._id;
  const requestId = req.params.requestId;
  const request = await travelerService.travelerViewRequestById(id, requestId, res);
  res.status(httpStatus.OK).send(request);
});
const viewAllTravelers = catchAsync(async (req, res) => {
  const id = req.user._id;
  const travelers = await travelerService.viewAllTravelers(id, res);
  return travelers;
});

const AddRating = catchAsync(async (req, res) => {
  const id = req.user._id;
  const rating = await travelerService.AddRating(id, req, res);
  return rating;
});
const ViewRating = catchAsync(async (req, res) => {
  const id = req.user._id;
  const rating = await travelerService.ViewRating(id, req, res);
  return rating;
});
const TravelerOnHisWay = catchAsync(async (req, res) => {
  const id = req.user._id;
  const traveler = await travelerService.TravelerOnHisWay(id, req, res);
  return traveler;
});

module.exports = {
  IsStudent,
  IsEmployee,
  AddTraveler,
  updateTraveller,
  // deleteTraveller,
  getTraveller,
  gettravellerOwnRequests,
  TravelerViewRequestById,
  viewAllTravelers,

  AddRating,
  ViewRating,

  TravelerOnHisWay,
};
