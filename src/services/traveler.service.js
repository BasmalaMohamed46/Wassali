const User = require('../models/user.model');
const fs = require('fs');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Traveler = require('../models/traveler.model');
const Request = require('../models/request.model');
const Rating = require('../models/rating.model');
const Trip = require('../models/trip.model');
const sendEmail = require('./sendEmail');

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

const createTraveler = async (id, req, res) => {
  try {
    const foundedTraveler = await Traveler.findOne({ userId: id });
    const { NationalId } = req.body;

    if (req.fileUploadError) {
      return { message: 'Invalid file, accepted files->(png, jpg, jpeg)' };
    }

    if (foundedTraveler.isStudent) {
      const requiredFields = ['NationalIdCard', 'StudentUniversityId', 'CollegeEnrollmentStatement'];
      for (const field of requiredFields) {
        if (!req.files[field]) {
          return { message: `${field} is required` };
        }
      }

      const urls = {
        StudentUniversityId: `${req.protocol}://${req.headers.host}/${req.destination}/${req.files.StudentUniversityId[0].filename}`,
        CollegeEnrollmentStatement: `${req.protocol}://${req.headers.host}/${req.destination2}/${req.files.CollegeEnrollmentStatement[0].filename}`,
        NationalIdCard: `${req.protocol}://${req.headers.host}/${req.destination5}/${req.files.NationalIdCard[0].filename}`,
      };

      const updatedUser = await Traveler.findByIdAndUpdate(
        foundedTraveler._id,
        {
          NationalId,
          EmployeeCompanyId: null,
          ...urls,
        },
        { new: true }
      );

      await User.findByIdAndUpdate(id, { role: 'traveler' }, { new: true });
      const user = await User.findById(id);
      const message = `
      <html>
        <body>
          <h2>Dear ${user.name},</h2>
          <h3>Your Document Review Notification</h3>
          <p>Thank you for joining our platform as a traveler. We would like to inform you that your document has been received and is currently under review by our admin team. We will notify you as soon as the review process is completed.</p>
          <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
          <p>Best regards,</p>
          <p>Your Platform Team</p>
        </body>
      </html>
      `;
      sendEmail(user.email, message);
      return res.status(200).json({
        message: 'Traveler created successfully',
        updatedUser,
      });
    } else {
      const requiredFields = ['NationalIdCard', 'EmployeeCompanyId'];
      for (const field of requiredFields) {
        if (!req.files[field]) {
          return { message: `${field} is required` };
        }
      }

      const urls = {
        EmployeeCompanyId: `${req.protocol}://${req.headers.host}/${req.destination3}/${req.files.EmployeeCompanyId[0].filename}`,
        NationalIdCard: `${req.protocol}://${req.headers.host}/${req.destination5}/${req.files.NationalIdCard[0].filename}`,
      };

      const updatedUser = await Traveler.findByIdAndUpdate(
        foundedTraveler._id,
        {
          NationalId,
          StudentUniversityId: null,
          CollegeEnrollmentStatement: null,
          ...urls,
        },
        { new: true }
      );

      await User.findByIdAndUpdate(id, { role: 'traveler' }, { new: true });
      const user = await User.findById(id);
      const message = `
      <html>
        <body>
          <h2>Dear ${user.name},</h2>
          <h3>Your Document Review Notification</h3>
          <p>Thank you for joining our platform as a traveler. We would like to inform you that your document has been received and is currently under review by our admin team. We will notify you as soon as the review process is completed.</p>
          <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
          <p>Best regards,</p>
          <p>Your Platform Team</p>
        </body>
      </html>
      `;
      sendEmail(user.email, message);
      return res.status(200).json({
        message: 'Traveler created successfully',
        updatedUser,
      });
    }
  } catch (error) {
    return { message: 'Something went wrong', err: error.message };
  }
};
const updateTraveler = async (id, req) => {
  try {
    // const id = req.user._id;

    const travelerExist = await Traveler.findOne({
      userId: id,
    });
    if (travelerExist) {
      const updateTraveler = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
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
const TravelerOnHisWay = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const traveler = await Traveler.find({ userId: id });
      if (traveler) {
        console.log(traveler);
        const requestId = req.params.requestId;
        console.log(traveler[0].Trip);
        const tripId = traveler[0].Trip[traveler[0].Trip.length - 1];
        const trip = await Trip.findById(tripId);
        if (trip.AcceptedRequests.includes(requestId)) {
          const request = await Request.findById(requestId);
          if (request) {
            request.state = 'onmyway';
            await request.save();
            res.status(httpStatus.OK).json({
              message: 'Request updated successfully',
              request,
            });
          } else {
            res.status(httpStatus.NOT_FOUND).json({
              message: 'Request not found',
            });
          }
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            message: 'Request not found in accepted requests',
          });
        }
      } else {
        res.status(httpStatus.NOT_FOUND).json({
          message: 'Traveler not found',
        });
      }
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
const AddRating = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      const traveler = req.params.travelerId;
      const { rating } = req.body;

      const foundedTraveler = await Traveler.findOne({ userId: id });
      console.log(foundedTraveler);
      if (foundedTraveler) {
        if (foundedTraveler._id != traveler) {
          const newRating = new Rating({
            traveler,
            rating,
          });

          await newRating.save();

          res.json(newRating);
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            message: 'You can not rate yourself',
          });
        }
      } else {
        const newRating = new Rating({
          traveler,
          rating,
        });

        await newRating.save();
        res.json(newRating);
      }
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

const ViewRating = async (id, req, res) => {
  try {
    const ratings = await Rating.find({ traveler: req.params.travelerId });
    res.json(ratings);
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

  AddRating,
  ViewRating,

  TravelerOnHisWay,
};
