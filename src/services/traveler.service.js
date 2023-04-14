const User = require('../models/user.model');
const fs = require('fs');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Traveler = require('../models/traveler.model');
const Request = require('../models/request.model');
const Trip = require('../models/trip.model');

const Student = async (id, res) => {
  // const id = req.user._id;
  const userExist = await User.findById(id);
  if (userExist) {
    const foundedTraveler = await Traveler.findOne({
      userId: id,
    });
    if (foundedTraveler) {
      if (foundedTraveler.isStudent) {
        res.status(httpStatus.NOT_FOUND).json({
          message: 'User is already a student',
        });
      } else {
        const traveler = await Traveler.findByIdAndUpdate(foundedTraveler._id, {
          isStudent: true,
        });
        res.status(httpStatus.CREATED).send(traveler);
      }
    } else {
      const traveler = await Traveler.create({
        isStudent: true,
        userId: id,
      });
      res.status(httpStatus.CREATED).send(traveler);
    }
  } else {
    res.status(httpStatus.NOT_FOUND).send('User not found');
  }
};

const Employee = async (id, res) => {
  // const id = req.user._id;
  const userExist = await User.findById(id);
  if (userExist) {
    const foundedTraveler = await Traveler.findOne({
      userId: id,
    });
    if (foundedTraveler) {
      if (!foundedTraveler.isStudent) {
        res.status(httpStatus.NOT_FOUND).json({
          message: 'User is already an employee',
        });
      } else {
        const traveler = await Traveler.findByIdAndUpdate(foundedTraveler._id, {
          isStudent: false,
        });
        res.status(httpStatus.CREATED).send(traveler);
      }
    } else {
      const traveler = await Traveler.create({
        isStudent: false,
        userId: id,
      });
      res.status(httpStatus.CREATED).send(traveler);
    }
  } else {
    res.status(httpStatus.NOT_FOUND).send('User not found');
  }
};

const createTraveler = async (id, req) => {
  try {
    // const id = req.user._id;

    const foundedTraveler = await Traveler.findOne({
      userId: id,
    });
    const { NationalId } = req.body;

    if (req.fileUploadError) {
      return {
        message: 'invalid file, accepted files->(png,jpg,jpeg)',
      };
    }
    // console.log(req.files.NationalIdCard);
    // console.log(req.files.NationalIdCard[0].filename);
    if (foundedTraveler.isStudent) {
      if (!req.files.NationalIdCard) {
        return {
          message: 'NationalIdCard is required',
        };
      }
      if (!req.files.StudentUniversityId) {
        return {
          message: 'StudentUniversityId is required',
        };
      }
      if (!req.files.CollegeEnrollmentStatement) {
        return {
          message: 'CollegeEnrollmentStatement is required',
        };
      }
      let StudentUniversityId_URL = `${req.protocol}://${req.headers.host}/${req.destination}/${req.files.StudentUniversityId[0].filename}`;
      let CollegeEnrollmentStatement_URL = `${req.protocol}://${req.headers.host}/${req.destination2}/${req.files.CollegeEnrollmentStatement[0].filename}`;
      let NationalIdCard_URL = `${req.protocol}://${req.headers.host}/${req.destination5}/${req.files.NationalIdCard[0].filename}`;
      // console.log(StudentUniversityId_URL);
      const updatedUser = await Traveler.findByIdAndUpdate(
        foundedTraveler._id,
        {
          NationalId,
          NationalIdCard: NationalIdCard_URL,
          StudentUniversityId: StudentUniversityId_URL,
          CollegeEnrollmentStatement: CollegeEnrollmentStatement_URL,
          EmployeeCompanyId: null,
        },
        {
          new: true,
        }
      );
      await User.findByIdAndUpdate(
        id,
        {
          role: 'traveler',
        },
        {
          new: true,
        }
      );
      return {
        message: 'Traveler created successfully',
        updatedUser,
      };
    } else {
      if (!req.files.NationalIdCard) {
        return {
          message: 'NationalIdCard is required',
        };
      }
      if (!req.files.EmployeeCompanyId) {
        return {
          message: 'EmployeeCompanyId is required',
        };
      }
      let EmployeeCompanyId_URL = `${req.protocol}://${req.headers.host}/${req.destination3}/${req.files.EmployeeCompanyId[0].filename}`;
      let NationalIdCard_URL = `${req.protocol}://${req.headers.host}/${req.destination5}/${req.files.NationalIdCard[0].filename}`;
      // console.log(EmployeeCompanyId_URL);
      const updatedUser = await Traveler.findByIdAndUpdate(
        foundedTraveler._id,
        {
          NationalId,
          EmployeeCompanyId: EmployeeCompanyId_URL,
          NationalIdCard: NationalIdCard_URL,
          StudentUniversityId: null,
          CollegeEnrollmentStatement: null,
        },
        {
          new: true,
        }
      );
      await User.findByIdAndUpdate(
        id,
        {
          role: 'traveler',
        },
        {
          new: true,
        }
      );
      return {
        message: 'Traveler created successfully',
        updatedUser,
      };
    }
  } catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    };
  }
};

const updateTraveler = async (id, req) => {
  try {
    // const id = req.user._id;
    const { city, governorate, name, birthDate, address } = req.body;
    const travelerExist = await Traveler.findOne({
      userId: id,
    });
    if (travelerExist) {
      const updateTraveler = await User.findByIdAndUpdate(
        id,
        {
          city,
          governorate,
          name,
          birthDate,
          address,
        },
        {
          new: true,
        }
      );
      return {
        message: 'Traveler updated successfully',
        updateTraveler,
      };
    } else {
      return {
        message: 'Traveler not found',
      };
    }
  } catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    };
  }
};
// const deleteTraveler = async (id, res) => {
//   try {
//     const foundedTraveler = await Traveler.findOne({
//       userId: id
//     });
//     if (foundedTraveler) {
//       const traveler = await Traveler.findOneAndDelete({
//         userId: id
//       });
//       res.status(httpStatus.OK).json({
//         message: 'Traveler deleted successfully',
//         traveler
//       })
//     } else {
//       res.status(httpStatus.NOT_FOUND).json({
//         message: 'Traveler not found',
//       })

//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       message: 'Something went wrong',
//       err: error.message,
//     })
//   }

// }

const viewTraveler = async (id, res) => {
  try {
    const user = await User.findById(id);
    const traveler = await Traveler.findOne({ userId: id });
    if (traveler) {
      res.status(httpStatus.OK).json({
        message: 'Traveler found',
        traveler,
        user,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'Traveler not found',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    });
  }
};

const getTravellerOwnRequests = async (id, res) => {
  try {
    const traveler = await Traveler.findOne({
      userId: id,
    });
    if (traveler) {
      const trips = await Trip.find({
        Traveler: traveler._id,
      }).populate('RequestsList');

      res.status(httpStatus.OK).json({
        message: 'Requests',
        trips,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'No requests',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    });
  }
};

const travelerViewRequestById = async (id, requestId, res) => {
  try {
    const traveler = await Traveler.findOne({
      userId: id,
    });
    if (traveler) {
      const trips = await Trip.find({
        Traveler: traveler._id,
      }).populate('RequestsList');

      const requ = trips.map((trip) =>
        trip.RequestsList.map((request) => {
          if (request._id == requestId) {
            res.status(httpStatus.OK).json({
              message: 'Request found',
              request,
            });
          }
        })
      );

      res.status(httpStatus.OK).json({
        message: 'Requests',
        requ,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'Traveler not found',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    });
  }
};

const viewAllTravelers = async (id, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const travelers = await Traveler.find().populate('userId');
      res.status(httpStatus.OK).json({
        message: 'Travelers found',
        travelers,
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: error.message,
    });
  }
};
module.exports = {
  Student,
  Employee,
  createTraveler,
  updateTraveler,
  // deleteTraveler,
  viewTraveler,
  getTravellerOwnRequests,
  travelerViewRequestById,
  viewAllTravelers,
};
