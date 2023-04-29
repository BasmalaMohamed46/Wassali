const Admin=require('../models/admin.model')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { findByIdAndDelete } = require('../models/admin.model');
const { User, Traveler , Request} = require('../models');


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

  const getAllTravelers = async (req,res) => {
    const travelers=await Traveler.find({role:"traveler"})
    if(!travelers)
    {
      res.status(404).json({
        message: 'travelers not exist',
      })
    }
    else
    {
      res.status(200).json({
        message: 'travelers exist',
        travelers
      })
    }
}

const deleteTraveler = async (req,res) => {
  const traveler=await Traveler.findById(req.params.travelerId)
  if(!traveler)
  {
    res.status(404).json({
      message: 'traveler not exist',
    })
  }
  else
  {
    const deleted= await Traveler.findByIdAndDelete(req.params.travelerId)
    res.status(200).json({
      message: 'traveler deleted',
      deleted
    })
  }
};

const updateTraveler = async (req,res) => {
  const traveler=await Traveler.findById(req.params.travelerId)
  if(!traveler)
  {
    res.status(404).json({
      message: 'traveler not exist',
    })
  }
  else
  {
    const updated= await Traveler.findByIdAndUpdate(req.params.travelerId,req.body)
    res.status(200).json({
      message: 'traveler updated',
      updated
    })
  }
};


const getTraveler = async (req,res) => {
  const traveler=await Traveler.findById(req.params.travelerId)
  if(!traveler)
  {
    res.status(404).json({
      message: 'traveler not exist',
    })
  }
  else
  {
    res.status(200).json({
      message: 'traveler exist',
      traveler
    })
  }
};
const getRequest= async (req,res) => {
  try{
    const request=await Request.findById(req.params.requestId)
    if(!request)
    {
      res.status(404).json({
        message: 'request not exist',
      })
    }
    else
    {
      res.status(200).json({
        message: 'request exist',
        request
      })
    }
  }
  catch(err){
    res.status(500).json({
      message: 'server error',
      err
    })
  }
}
const getRequests= async (req,res) => {
  try{
    const requests=await Request.find({})
    if(!requests)
    {
      res.status(404).json({
        message: 'requests not exist',
      })
    }
    else
    {
      res.status(200).json({
        message: 'requests exist',
        requests
      })
    }
  }
  catch(err){
    res.status(500).json({
      message: 'server error',
      err
    })
  }
}
const deleteRequest= async (req,res) => {
  try{
    const request=await Request.findById(req.params.requestId)
    if(!request)
    {
      res.status(404).json({
        message: 'requests not exist',
      })
    }
    else{
       if(request.buyOrdeliver == 'deliver'){
        const deletedRequest=await Request.findByIdAndDelete(req.params.requestId)
        res.status(200).json({
          message: 'request deleted',
          deletedRequest
        })
       }
       else{
        if(request.price >5000){
          const deletedRequest=await Request.findByIdAndDelete(req.params.requestId)
        res.status(200).json({
          message: 'request deleted',
          deletedRequest
        })
        } else{
          res.status(200).json({
            message: 'request not deleted because its less than 5000',
          })
        }
       }
       
       
    }
  }
  catch(err){
    res.status(500).json({
      message: 'server error',
      err
    })
  }
}
  module.exports = {
    createAdmin,
    loginUserWithEmailAndPasswordAdmin,
    getUserByEmailAdmin,
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
    deleteRequest
    }
