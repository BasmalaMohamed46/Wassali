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


module.exports = {
    CreateTrip,
  deleteTrip,
};
