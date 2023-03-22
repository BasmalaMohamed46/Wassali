const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  adminService
} = require('../services');
const register = catchAsync(async (req, res) => {
    const admin = await adminService.createAdmin(req.body);
    res.status(httpStatus.CREATED).send(admin);
  });
  
  const login = catchAsync(async (req, res) => {
    const {
      email,
      password
    } = req.body;
    const admin = await adminService.loginUserWithEmailAndPasswordAdmin(email, password, res);
    res.send(admin);
  });
  

  

  const deleteUser = catchAsync(async (req, res) => {
    const id = req.admin._id;
    const deleteUser = await adminService.deleteUser(id,req);
    res.status(httpStatus.OK).send(deleteUser);
  });
  const updateUser = catchAsync(async (req, res) => {
    const id = req.admin._id;
    const updateUser = await adminService.updateUser(id,req);
    res.status(httpStatus.OK).send(updateUser);
  });

  const getAllUsers = catchAsync(async (req, res) => {
    const id = req.admin._id;
    const getAllUsers = await adminService.getAllUsers(id,req);
    res.status(httpStatus.OK).send(getAllUsers);
  });
  const getUser= catchAsync(async (req, res) => {
    const id = req.admin._id;
    const getUser = await adminService.getUser(id,req);
    res.status(httpStatus.OK).send(getUser);
    });

  


  

  module.exports = {
    register,
    login,
    deleteUser,
    updateUser,
    getAllUsers,
    getUser

  
}