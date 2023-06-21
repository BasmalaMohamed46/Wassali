const httpStatus = require('http-status');
const Trip = require('../models/trip.model');
const Traveler = require('../models/traveler.model');
const User = require('../models/user.model');

const addTrip = async (id, req) => {
  try {
    const userExist = await User.findById(id);
    if (userExist) {
      let foundedTraveler = await Traveler.findOne({ userId: id });
      // if (!foundedTraveler.isAdminVerificationPending) {
      //   return {
      //     message: 'Your document is under review. You will be notified by email soon.',
      //   };
      // } else {
        const { from, to, TripDate, AvailableWeight, unAcceptablaPackage, TripTime } = req.body;
        if (foundedTraveler) {
          const trip = await Trip.insertMany({
            from,
            to,
            TripDate,
            AvailableWeight,
            unAcceptablaPackage,
            Traveler: foundedTraveler._id,
            TripTime,
          });
          await Traveler.findByIdAndUpdate(
            { _id: foundedTraveler._id },
            { $push: { Trip: trip[0]._id } },
            { new: true }
          );
          return {
            message: 'Trip added successfully',
            trip,
          };
        } else {
          return {
            message: 'Trip not added',
          };
        }
      // }
    } else {
      return {
        message: 'User not found',
      };
    }
  } catch (error) {
    return {
      message: 'Something went wrong',
      err: error.message,
    };
  }
};

const deleteTrip = async (id, res, tripId) => {
  try {
    let foundedTraveler = await Traveler.findOne({ userId: id });
    if (foundedTraveler) {
      const foundedTrip = await Trip.findById(tripId);
      if (foundedTrip) {
        if (foundedTrip.Traveler.toString() == foundedTraveler._id.toString()) {
          if (foundedTrip.AcceptedRequests.length == 0) {
            const trip = await Trip.findByIdAndDelete(tripId);
            foundedTraveler = await Traveler.findByIdAndUpdate(
              { _id: foundedTraveler._id },
              { $pull: { Trip: trip._id } },
              { new: true }
            );
            res.status(httpStatus.OK).json({
              message: 'Trip deleted successfully',
              trip,
            });
          } else {
            res.status(404).json({
              message: 'You can not delete this trip because there are accepted requests',
            });
          }
        } else {
          res.status(404).json({
            message: 'You are not allowed to delete this trip',
          });
        }
      } else {
        res.status(404).json({
          message: 'Trip not found',
        });
      }
    } else {
      res.status(404).json({
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

const viewtrips = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const trips = await Trip.find();
      if (trips.length > 0) {
        res.status(httpStatus.OK).json({
          message: 'Trips found successfully',
          trips,
        });
      } else {
        res.status(httpStatus.OK).json({
          message: 'No Trips founded',
        });
      }
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'You are not allowed to view trips',
      });
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      err: err.message,
    };
  }
};

const viewtravelertrips = async (id, req, res) => {
  try {
    const traveler = await Traveler.findOne({ userId: id });
    if (traveler) {
      const trips = await Trip.find({ Traveler: traveler._id });
      if (trips.length > 0) {
        res.status(httpStatus.OK).json({
          message: 'Trips found successfully',
          trips,
        });
      } else {
        res.status(httpStatus.OK).json({
          message: 'No Trips founded',
        });
      }
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'You are not allowed to view trips',
      });
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      err: err.message,
    };
  }
};

const viewtrip = async (id, req, res, tripId) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const trip = await Trip.findById(tripId);
      if (trip) {
        res.status(httpStatus.OK).json({
          message: 'Trip found successfully',
          trip,
        });
      } else {
        res.status(httpStatus.NOT_FOUND).json({
          message: 'Trip not found',
        });
      }
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'You are not allowed to view trips',
      });
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      err: err.message,
    };
  }
};

const updateTrip = async (id, req, res, tripId) => {
  try {
    const userExist = await User.findById(id);
    if (userExist) {
      let foundedTraveler = await Traveler.findOne({
        userId: id,
      });

      if (foundedTraveler) {
        if (foundedTraveler.Trip.includes(tripId)) {
          const trip = await Trip.findByIdAndUpdate(
            {
              _id: tripId,
            },
            req.body,
            {
              new: true,
            }
          );
          return {
            message: 'Trip updated successfully',
            trip,
          };
        } else {
          res.status(404).json({
            message: 'You are not allowed to update this trip',
          });
        }
      } else {
        res.status(404).json({
          message: 'Traveler not found',
        });
      }
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      err: err.message,
    });
  }
};

const filterTripsByCity = async (req, res) => {
  const { from } = req.body;
  try {
    const trips = await Trip.find({ from: { $regex: from, $options: 'i' } });
    if (trips.length === 0) {
      return res.status(404).json({ message: 'No Trips found for this city' });
    }
    res.status(200).json({ trips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addTrip,
  deleteTrip,
  viewtrips,
  viewtravelertrips,
  viewtrip,
  updateTrip,
  filterTripsByCity,
};
