const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  travelerService
} = require('../services');

const IsStudent = catchAsync(async (req, res) => {
  const id = req.user._id;
  const student = await travelerService.Student(id,res);
  res.send(student);
});

const IsEmployee = catchAsync(async (req, res) => {
  const id = req.user._id;
  const employee = await travelerService.Employee(id,res);
  res.status(httpStatus.OK).send(employee);
});

const AddTraveler = catchAsync(async (req, res) => {
  const id = req.user._id;
  const addTraveler = await travelerService.createTraveler(id,req);
  res.status(httpStatus.CREATED).send(addTraveler);
});

const updateTraveller = catchAsync(async (req, res) => {
  const id = req.user._id;
  const update = await travelerService.updateTraveler(id,req);
  res.status(httpStatus.OK).send(update);
});
const deleteTraveller = catchAsync(async (req, res) => {
  const id = req.user._id;
  const deleted = await travelerService.deleteTraveler(id,res);
  res.status(httpStatus.OK).send(deleted);
});
const getTraveller = catchAsync(async (req, res) => {
  const id = req.user._id;
  const traveler = await travelerService.viewTraveler(id,res);
  res.status(httpStatus.OK).send(traveler);

});




module.exports = {
  IsStudent,
  IsEmployee,
  AddTraveler,
  updateTraveller,
  deleteTraveller,
  getTraveller,
};
