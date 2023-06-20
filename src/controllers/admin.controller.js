const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, adminService } = require('../services');
const User = require('../models/user.model');
const register = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  const user = await User.create(req.body);
  user.role = 'admin';
  user.isEmailVerified=true;
  await user.save();
  res.status(httpStatus.CREATED).send(admin);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminService.loginUserWithEmailAndPasswordAdmin(email, password, res);
  res.send(admin);
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.admin._id;
  const deleteUser = await adminService.deleteUser(id, req);
  res.status(httpStatus.OK).send(deleteUser);
});
const updateUser = catchAsync(async (req, res) => {
  const id = req.admin._id;
  const updateUser = await adminService.updateUser(id, req);
  res.status(httpStatus.OK).send(updateUser);
});

const getAllUsers = catchAsync(async (req, res) => {
  const id = req.admin._id;
  const getAllUsers = await adminService.getAllUsers(id, req);
  res.status(httpStatus.OK).send(getAllUsers);
});
const getUser = catchAsync(async (req, res) => {
  const id = req.admin._id;
  const getUser = await adminService.getUser(id, req);
  res.status(httpStatus.OK).send(getUser);
});

//Traveler
const getAllTravelers = catchAsync(async (req, res) => {
  const getAllTravelers = await adminService.getAllTravelers(req, res);
  res.status(httpStatus.OK).send(getAllTravelers);
});

const deleteTraveler = catchAsync(async (req, res) => {
  const deleteTraveler = await adminService.deleteTraveler(req, res);
  res.status(httpStatus.OK).send(deleteTraveler);
});

const updateTraveler = catchAsync(async (req, res) => {
  const updateTraveler = await adminService.updateTraveler(req, res);
  res.status(httpStatus.OK).send(updateTraveler);
});

const getTraveler = catchAsync(async (req, res) => {
  const getTraveler = await adminService.getTraveler(req, res);
  res.status(httpStatus.OK).send(getTraveler);
});

const getRequest = catchAsync(async (req, res) => {
  const getRequest = await adminService.getRequest(req, res);
  return getRequest;
});

const getRequests = catchAsync(async (req, res) => {
  const getRequests = await adminService.getRequests(req, res);
  return getRequests;
});
const deleteRequest = catchAsync(async (req, res) => {
  const deleteRequest = await adminService.deleteRequest(req, res);
  return deleteRequest;
});

//trips
const getTrip = catchAsync(async (req, res) => {
  const getTrip = await adminService.getTrip(req, res);
  return getTrip;
});

const getAllTrips = catchAsync(async (req, res) => {
  const getAllTrips = await adminService.getAllTrips(req, res);
  return getAllTrips;
});

const deleteTrip = catchAsync(async (req, res) => {
  const deleteTrip = await adminService.deleteTrip(req, res);
  return deleteTrip;
});

const verifyDocuments = catchAsync(async (req, res) => {
  const verifyDocuments = await adminService.verifyDocuments(req, res);
  return verifyDocuments;
});

module.exports = {
  register,
  login,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
  getAllTravelers,
  deleteTraveler,
  updateTraveler,
  getTraveler,
  getRequest,
  getRequests,
  deleteRequest,
  getTrip,
  getAllTrips,
  deleteTrip,
  verifyDocuments,
};
