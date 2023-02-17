const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  travelerService
} = require('../services');

const IsStudent = catchAsync(async (req, res) => {
  const id = req.user._id;
  const student = await travelerService.Student(id);
  res.send(student);
});

const IsEmployee = catchAsync(async (req, res) => {
  const id = req.user._id;
  const employee = await travelerService.Employee(id);
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


module.exports = {
  IsStudent,
  IsEmployee,
  AddTraveler,
  updateTraveller
};
