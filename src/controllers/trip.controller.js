const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {tripService} = require('../services');

const CreateTrip = catchAsync(async (req, res) => {

  const id = req.user._id;
  const addTrip = await tripService.addTrip(id,req);
  res.status(httpStatus.CREATED).send(addTrip);
});


const deleteTrip = catchAsync(async (req, res) => {
    const tripId = req.params.tripId;
  const id = req.user._id;
  const deleted = await tripService.deleteTrip(id,res,tripId);
  res.status(httpStatus.OK).send(deleted);
});

const ViewTrips = catchAsync(async (req, res) => {

  const id = req.user._id;
  const viewtrips = await tripService.viewtrips(id,req,res);
  res.status(httpStatus.CREATED).send(viewtrips);
});

const ViewTravelerTrips = catchAsync(async (req, res) => {

  const id = req.user._id;
  const viewtravelertrips = await tripService.viewtravelertrips(id,req,res);
  res.status(httpStatus.CREATED).send(viewtravelertrips);
});

const ViewTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const id = req.user._id;
  const viewtrip = await tripService.viewtrip(id,req,res,tripId);
  res.status(httpStatus.CREATED).send(viewtrip);
});

const updateTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId;
  const id = req.user._id;
  const updateTrip = await tripService.updateTrip(id,req,res,tripId);
  res.status(httpStatus.CREATED).send(updateTrip);
});

module.exports = {
  CreateTrip,
  deleteTrip,
  ViewTrips,
  ViewTravelerTrips,
  ViewTrip,
  updateTrip
};
