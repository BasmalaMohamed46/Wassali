const Admin=require('../models/admin.model')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { findByIdAndDelete } = require('../models/admin.model');
const { User } = require('../models');


const createAdmin = async (userBody) => {
 
    return Admin.create(userBody)
  };

  const getUserByEmailAdmin = async (email) => {
    return Admin.findOne({
      email
    });
  };

  const loginUserWithEmailAndPasswordAdmin = async (email, password, res) => {
    const admin = await getUserByEmailAdmin(email);
    if (!admin || !(await admin.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    const token = jwt.sign({
      id: admin._id,
      admin:admin,
    },
      process.env.JWT_SECRET)
    // return user;
    res.json({
      message: 'admin exist',
      token
    })
  };

  const deleteUser = async (id,req) => {
  const user=await User.findById(req.params.userId)
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
    else{
       const deleted= await User.findByIdAndDelete(req.params.userId)
         return {
            message:"user deleted",
            deleted
         }

    }
  }
  const updateUser = async (id,req) => {
    const user=await User.findById(req.params.userId)
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
    else{
        const updated= await User.findByIdAndUpdate(req.params.userId,req.body)
         return {
            message:"user updated",
            updated
         }

    }
  }
  const getAllUsers= async (id,req) => {
    const users=await User.find({})
    if(!users){
        throw new ApiError(httpStatus.OK, 'Users not found');
        }
    else{
         return {
            message:"users found",
            users
         }

    }
  }
  const getUser= async (id,req) => {
    const user=await User.findById(req.params.userId)
    if(!user){
        throw new ApiError(httpStatus.OK, 'User not found');
        }
    else{
            return {
                message:"user found",
                user
            }
    
        }
        
  }

  module.exports = {
    createAdmin,
    loginUserWithEmailAndPasswordAdmin,
    getUserByEmailAdmin,
    deleteUser,
    updateUser,
    getAllUsers,
    getUser
    }