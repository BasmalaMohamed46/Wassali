const Admin = require('../models/admin.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { User, Traveler, Request } = require('../models');
const Trip = require('../models/trip.model');
const sendEmail = require('./sendEmail');

const createAdmin = async (userBody) => {
  return Admin.create(userBody);
};

const getUserByEmailAdmin = async (email) => {
  return Admin.findOne({
    email,
  });
};

const loginUserWithEmailAndPasswordAdmin = async (email, password, res) => {
  const admin = await getUserByEmailAdmin(email);
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  const token = jwt.sign(
    {
      id: admin._id,
      admin: admin,
    },
    process.env.JWT_SECRET
  );
  // return user;
  res.json({
    message: 'admin exist',
    token,
  });
};

const deleteUser = async (id, req) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  } else {
    const deleted = await User.findByIdAndDelete(req.params.userId);
    return {
      message: 'user deleted',
      deleted,
    };
  }
};
const updateUser = async (id, req) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  } else {
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body);
    return {
      message: 'user updated',
      updated,
    };
  }
};
const getAllUsers = async (id, req) => {
  const users = await User.find({});
  if (!users) {
    throw new ApiError(httpStatus.OK, 'Users not found');
  } else {
    return {
      message: 'users found',
      users,
    };
  }
};
const getUser = async (id, req) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.OK, 'User not found');
  } else {
    return {
      message: 'user found',
      user,
    };
  }
};

const getAllTravelers = async (req, res) => {
  const travelers = await Traveler.find({}).populate('userId');
  if (!travelers) {
    res.status(404).json({
      message: 'travelers not exist',
    });
  } else {
    res.status(200).json({
      message: 'travelers exist',
      travelers,
    });
  }
};

const deleteTraveler = async (req, res) => {
  const traveler = await Traveler.findById(req.params.travelerId);
  if (!traveler) {
    res.status(404).json({
      message: 'traveler not exist',
    });
  } else {
    const deleted = await Traveler.findByIdAndDelete(req.params.travelerId);
    res.status(200).json({
      message: 'traveler deleted',
      deleted,
    });
  }
};

const updateTraveler = async (req, res) => {
  const traveler = await Traveler.findById(req.params.travelerId);
  if (!traveler) {
    res.status(404).json({
      message: 'traveler not exist',
    });
  } else {
    const updated = await Traveler.findByIdAndUpdate(req.params.travelerId, req.body);
    res.status(200).json({
      message: 'traveler updated',
      updated,
    });
  }
};

const getTraveler = async (req, res) => {
  const traveler = await Traveler.findById(req.params.travelerId);
  if (!traveler) {
    res.status(404).json({
      message: 'traveler not exist',
    });
  } else {
    res.status(200).json({
      message: 'traveler exist',
      traveler,
    });
  }
};
const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      res.status(404).json({
        message: 'request not exist',
      });
    } else {
      res.status(200).json({
        message: 'request exist',
        request,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'server error',
      err,
    });
  }
};
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({});
    if (!requests) {
      res.status(404).json({
        message: 'requests not exist',
      });
    } else {
      res.status(200).json({
        message: 'requests exist',
        requests,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'server error',
      err,
    });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      res.status(404).json({
        message: 'requests not exist',
      });
    } else {
      if (request.buyOrdeliver == 'deliver') {
        const deletedRequest = await Request.findByIdAndDelete(req.params.requestId);
        res.status(200).json({
          message: 'request deleted',
          deletedRequest,
        });
      } else {
        if (request.price > 5000) {
          const deletedRequest = await Request.findByIdAndDelete(req.params.requestId);
          res.status(200).json({
            message: 'request deleted',
            deletedRequest,
          });
        } else {
          res.status(200).json({
            message: 'request not deleted because its less than 5000',
          });
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      message: 'server error',
      err,
    });
  }
};

//trips
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }
    return res.status(200).json({
      message: 'Trip found',
      trip,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      err: err.message,
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});
    if (trips.length === 0) {
      return res.status(404).json({
        message: 'No trips found',
      });
    }
    return res.status(200).json({
      message: 'Trips found',
      trips,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      err: err.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }
    const deleted = await Trip.findByIdAndDelete(req.params.tripId);
    return res.status(200).json({
      message: 'Trip deleted',
      deleted,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      err: err.message,
    });
  }
};

const verifyDocuments = async (req, res) => {
  try {
    const traveler = await Traveler.findById(req.params.travelerId);
    console.log(traveler);
    if (!traveler) {
      return res.status(404).json({
        message: 'traveler not found',
      });
    }
    const updated = await Traveler.findByIdAndUpdate(req.params.travelerId, { isAdminVerificationPending: true });
    const user = await User.findById(traveler.userId);
    const message = `
    <html>
      <body>
        <h2>Dear ${user.name},</h2>
        <h3>Congratulations! Your Documents Have Been Verified</h3>
        <p>Thank you for joining our platform as a traveler. We are delighted to inform you that your documents have been verified successfully.</p>
        <p>You are now a registered traveler and can start exploring and planning your trips. We hope you have an amazing experience using our services.</p>
        <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      </body>
    </html>`;
    sendEmail(user.email, message);
    return res.status(200).json({
      message: 'traveler verified',
      updated,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      err: err.message,
    });
  }
};

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
  deleteRequest,
  getTrip,
  getAllTrips,
  deleteTrip,
  verifyDocuments,
};
