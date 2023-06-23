const httpStatus = require('http-status');
const stripe = require('stripe')(
  'sk_test_51Lw5pDCxmiDIHzo9pw3RmUcikOZyISs8JZZN1F2zodSOabqIOC85NaEoPvy6dgXTZUhq3a7IiqzV14Ej2fBVUpwp00iaPZyU6g'
);
const { Request } = require('../models');
const { User } = require('../models');
const { Traveler } = require('../models');
// const {
//   Trip
// } = require('../models');
const ApiError = require('../utils/ApiError');
const Trip = require('../models/trip.model');

const conversationService = require('./conversation.service');
const Conversation = require('../models/Conversation');

/**
 * Create a request
 * @param {Object} requestBody
 * @returns {Promise<Request>}
 */
if (process.env.RUN_STATUS === 'local') {
  redirectUrl = 'localhost:3001/home';
} else {
  redirectUrl = 'wasally.me';
}
const createRequest = async (id, req) => {
  const user = await User.findById(id);
  if (user) {
    if (user.requests.length === 0) {
      const request = await Request.create({
        userId: id,
        ...req.body,
      });
      await User.findByIdAndUpdate(id, {
        $push: {
          requests: request._id,
        },
      });
      await conversationService.createConversation(request._id, req);
      return {
        message: 'Request added successfully',
        request,
      };
    } else {
      const requestt = await Request.findById(user.requests[user.requests.length - 1]);
      if (requestt.state !== 'delivered') {
        throw new ApiError(httpStatus.NOT_FOUND, 'you have a request that is not delivered yet');
      } else {
        const request = await Request.create({
          userId: id,
          ...req.body,
        });
        await User.findByIdAndUpdate(id, {
          $push: {
            requests: request._id,
          },
        });
        await conversationService.createConversation(request._id, req);
        return {
          message: 'Request added successfully',
          request,
        };
      }
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

/**
 * Query for requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryRequests>}
 */
const queryRequests = async (filter, options) => {
  const requests = await Request.paginate(filter, options);
  return requests;
};

/**
 * Get request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestById = async (id) => {
  return Request.findById(id);
};

/**
 * Update request by id
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @returns {Promise<Request>}
 */
const updateRequestById = async (id, req) => {
  const user = await User.findById(id);
  if (user) {
    if (user.requests.includes(req.params.requestId)) {
      const request = await Request.findByIdAndUpdate(req.params.requestId, req.body, {
        new: true,
      });
      return {
        message: 'Request updated successfully',
        request,
      };
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to update this request');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

/**
 * Delete request by id
 * @param {ObjectId} requestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (id, req) => {
  const userExist = await User.findById(id);
  if (userExist) {
    if (userExist.requests.includes(req.params.requestId)) {
      const request = await Request.findById(req.params.requestId);
      if (
        request.state == 'accepted' ||
        request.state == 'pickedup' ||
        request.state == 'onmyway' ||
        request.state == 'delivered'
      ) {
        return {
          message: 'Sorry, you can not delete this request',
        };
      } else {
        if (request.trip) {
          const tripId = request.trip;
          // console.log(trip.RequestsList);
          await Request.findByIdAndDelete(req.params.requestId);
          await User.findByIdAndUpdate(id, {
            $pull: {
              requests: req.params.requestId,
            },
          });
          await Trip.findByIdAndUpdate(tripId, {
            $pull: {
              RequestsList: req.params.requestId,
            },
          });
          return {
            message: 'Request deleted successfully',
            request,
          };
        } else {
          await Request.findByIdAndDelete(req.params.requestId);
          await User.findByIdAndUpdate(id, {
            $pull: {
              requests: req.params.requestId,
            },
          });
          return {
            message: 'Request deleted successfully',
            request,
          };
        }
      }
    } else {
      return {
        message: 'you are not allowed to delete this request',
      };
    }
  } else {
    return {
      message: 'user not found',
    };
  }
};
const sendrequest = async (id, tripId, req) => {
  const user = await User.findById(id);
  if (user) {
    if (user.requests.length === 0) {
      const trip = await Trip.findById(req.params.tripId);
      if (trip) {
        const request = await Request.create({
          userId: id,
          trip: tripId,
          ...req.body,
        });
        await User.findByIdAndUpdate(id, {
          $push: {
            requests: request._id,
          },
        });
        await Trip.findByIdAndUpdate(tripId, {
          $push: {
            RequestsList: request._id,
          },
        });
        await conversationService.createConversation(request._id, req);
        return {
          message: 'Request added successfully',
          request,
        };
      } else {
        return {
          message: 'Trip not found',
        };
      }
    } else {
      const requestt = await Request.findById(user.requests[user.requests.length - 1]);
      if (requestt.state !== 'delivered') {
        throw new ApiError(httpStatus.NOT_FOUND, 'you have a request that is not delivered yet');
      } else {
        const trip = await Trip.findById(req.params.tripId);
        if (trip) {
          const request = await Request.create({
            userId: id,
            trip: tripId,
            ...req.body,
          });
          await User.findByIdAndUpdate(id, {
            $push: {
              requests: request._id,
            },
          });
          await Trip.findByIdAndUpdate(tripId, {
            $push: {
              RequestsList: request._id,
            },
          });
          await conversationService.createConversation(request._id, req);
          return {
            message: 'Request added successfully',
            request,
          };
        } else {
          return {
            message: 'Trip not found',
          };
        }
      }
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

const userviewrequests = async (id, req) => {
  const user = await User.findById(id);
  if (user) {
    const requests = await Request.find({
      userId: id,
    });
    return {
      message: 'Requests found successfully',
      requests,
    };
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

const userviewrequest = async (id, req) => {
  const user = await User.findById(id);
  if (user) {
    if (user.requests.includes(req.params.requestId)) {
      const request = await Request.findById(req.params.requestId);
      return {
        message: 'Request found successfully',
        request,
      };
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to view this request');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

// accept specific request
const acceptrequest = async (id, requestId, req) => {
  const TravelerExist = await Traveler.findOne({
    userId: id,
  });
  if (TravelerExist) {
    const request = await Request.findById(req.params.requestId);
    const tripId = request.trip;
    const trip = await Trip.findById(tripId);
    if (trip) {
      if (trip.AcceptedRequests.includes(requestId)) {
        return {
          message: 'Request already accepted',
        };
      }
      await Trip.findByIdAndUpdate(tripId, {
        $push: {
          AcceptedRequests: requestId,
        },
        $pull: {
          RequestsList: requestId,
        },
      });

      await Request.findByIdAndUpdate(requestId, {
        $set: {
          state: 'accepted',
        },
      });

      const conversationId = request.conversation;
      const travelerId = await Traveler.find(trip.Traveler);
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: {
          members: travelerId[0]._id,
        },
      });
      return {
        message: 'Request accepted successfully',
      };
    } else {
      return {
        message: 'Trip not found',
      };
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'traveler not found');
  }
};

const declinerequest = async (id, requestId, req) => {
  // let requestId = req.params.requestId;
  const TravelerExist = await Traveler.findOne({
    userId: id,
  });
  if (TravelerExist) {
    const request = await Request.findById(req.params.requestId);
    const tripId = request.trip;
    console.log(tripId);
    const trip = await Trip.findById(tripId);
    if (trip) {
      await Trip.findByIdAndUpdate(tripId, {
        $pull: {
          RequestsList: requestId,
        },
      });
      await Request.findByIdAndUpdate(
        req.params.requestId,
        {
          trip: null,
        },
        {
          new: true,
        }
      );
      return {
        message: 'Request declined successfully',
      };
    } else {
      return {
        message: 'Trip not found',
      };
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Traveler not found');
  }
};

const viewAllRequests = async (req) => {
  const requests = await Request.find({ state: 'processing' });

  return {
    message: 'Requests found successfully',
    requests,
  };
};
const DeclineTrip = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      if (user.requests.includes(req.params.requestId)) {
        const request = await Request.findById(req.params.requestId);
        if (request.state === 'accepted') {
          request.state = 'processing';
          const tripId = request.trip;
          const trip = await Trip.findById(tripId);
          if (trip) {
            await Trip.findByIdAndUpdate(tripId, {
              $pull: {
                AcceptedRequests: req.params.requestId,
              },
            });
          }
          console.log(req.params.requestId);
          request.trip = null;
          request.tripPrice = null;
          await request.save();
          res.status(200).json({ message: 'request declined successfully' });
        } else {
          res.status(200).json({ message: 'this request is not accepted yet or already on the way' });
        }
      } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to edit this request');
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const TravelerAcceptRequest = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const traveler = await Traveler.find({ userId: id });
      if (traveler) {
        const request = await Request.findById(req.params.requestId);
        if (request.state === 'accepted') {
          res.status(200).json({ message: 'this request is already accepted' });
        } else {
          const tripId = traveler[0].Trip[traveler[0].Trip.length - 1];
          if (traveler[0].Trip.length === 0) {
            res.status(404).json({ message: 'you have no trips' });
          } else {
            if (!request.tripsRequests.includes(tripId)) {
              await Request.findByIdAndUpdate(
                req.params.requestId,
                {
                  $push: {
                    tripsRequests: tripId,
                    TripOfferedPrice: {
                      trip: tripId,
                      price: req.body.price,
                    },
                  },
                },
                {
                  new: true,
                }
              );
              res.status(200).json({ message: 'request added' });
            } else {
              res.status(200).json({ message: 'request already added' });
            }
          }
        }
      } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to accept this request');
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userAcceptTravelerRequest = async (id, req, res) => {
  const userExist = await User.findById(id);

  if (!userExist) {
    res.status(404).json({
      message: 'user not found',
    });
  } else {
    const tripId = req.params.tripId;
    const tripExist = await Trip.findById(tripId);
    if (!tripExist) {
      res.status(404).json({
        message: 'trip not found',
      });
    } else {
      const requestId = userExist.requests[userExist.requests.length - 1];
      const request = await Request.findById(requestId);
      if (request.state === 'accepted') {
        res.status(404).json({
          message: 'request already accepted',
        });
      }
      if (tripExist.AcceptedRequests.includes(requestId)) {
        res.status(404).json({
          message: 'request already accepted',
        });
      } else {
        await Trip.findByIdAndUpdate(tripId, {
          $push: {
            AcceptedRequests: requestId,
          },
        });
        const tripps = request.TripOfferedPrice;
        for (let i = 0; i < tripps.length; i++) {
          if (tripps[i].trip == tripId) {
            await Request.findByIdAndUpdate(
              requestId,
              {
                $set: {
                  state: 'accepted',
                  tripPrice: tripps[i].price,
                  trip: tripId,
                  TripOfferedPrice: [],
                  tripsRequests: [],
                },
              },
              {
                new: true,
              }
            );
          }
        }
        const travelerId = await Traveler.find(tripExist.Traveler);
        const conversationId = request.conversation;
        await Conversation.findByIdAndUpdate(conversationId, {
          $push: {
            members: travelerId[0]._id,
          },
        });
        res.status(200).json({
          message: 'request accepted successfully',
        });
      }
    }
  }
};

const viewTravelersRequests = async (id, req, res) => {
  const userExist = await User.findById(id);
  if (!userExist) {
    res.json({
      message: 'user not found',
    });
  } else {
    const requestId = userExist.requests[userExist.requests.length - 1];
    const requests = await Request.findById(requestId).populate({
      path: 'TripOfferedPrice.trip',
      select: '_id to from TripDate TripTime Traveler',
      populate: {
        path: 'Traveler',
        select: 'userId',
        populate: {
          path: 'userId',
          select: 'name phoneNumber',
        },
      },
    });

    res.status(200).json({
      message: 'requests found successfully',
      requests,
    });
  }
};
const viewRequestAfterAcceptance = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const request = await Request.findById(req.params.requestId);
      if (request) {
        if (user.requests.includes(req.params.requestId)) {
          if (
            request.state === 'accepted' ||
            request.state === 'onmyway' ||
            request.state === 'delivered' ||
            request.state === 'pickedup'
          ) {
            const requestDetails = await Request.findById(req.params.requestId).populate({
              path: 'trip',
              populate: {
                path: 'Traveler',
              },
            });
            res.status(200).json({ message: 'request found successfully', requestDetails });
          } else {
            res.status(200).json({ message: 'request is not accepted yet' });
          }
        } else {
          throw new ApiError(httpStatus.NOT_FOUND, 'you are not allowed to view this request');
        }
      } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'request not found');
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const ViewAllAcceptedRequests = async (id, req, res) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const requests = await Request.find({
        $or: [{ state: 'accepted' }, { state: 'onmyway' }, { state: 'delivered' }],
        userId: id,
      });
      if (requests) {
        res.status(200).json({ message: 'requests found successfully', requests });
      } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'requests not found');
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// checkout with tripPrice
const checkout = async (id, req, res) => {
  const request = await userviewrequests(id);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: request.requests[request.requests.length - 1].tripPrice * 100,
          product_data: {
            name: 'Delivery Fees',
            // description: '',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    //transfer to home page
    success_url: `http://${redirectUrl}`,
    //transfer to home page
    cancel_url: `http://${redirectUrl}`,
  });

  res.status(200).json({ message: 'Checkout Successfully', session: session.url });
};

//checkout with tripPrice + Price of the item
const checkoutWithPrice = async (id, req, res) => {
  const request = await userviewrequests(id);
  const totalPrice =
    request.requests[request.requests.length - 1].tripPrice + request.requests[request.requests.length - 1].price;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: totalPrice * 100,
          product_data: {
            name: 'Delivery Fees',
            description: 'Item Price + Delivery Fees',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    //transfer to home page
    success_url: `http://${redirectUrl}`,
    //transfer to home page
    cancel_url: `http://${redirectUrl}`,
  });

  res.status(200).json({ message: 'Checkout Successfully', session: session.url });
};

const filterRequestsByCity = async (req, res) => {
  const { from } = req.body;
  try {
    const requests = await Request.find({ from: { $regex: from, $options: 'i' } });
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No requests found for this city' });
    }
    res.status(200).json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAceeptedRequests = async (req, res) => {
  const id = req.user._id;
  const foundedUser = await User.findById(id);
  console.log(foundedUser);
  if (foundedUser.role === 'traveler') {
    const traveler = await Traveler.findOne({
      userId: id,
    });
    const trip = await Trip.findOne({
      Traveler: traveler._id,
    }).sort({ createdAt: -1 });
    const requests = await Request.find({
      trip: trip._id,
      $or: [{ state: 'accepted' }, { state: 'onmyway' }, { state: 'delivered' }],
    }).populate({
      path: 'userId',
      select: 'name phoneNumber',
    });
    res.status(200).json({
      message: 'requests found successfully',
      requests,
    });
  } else {
    return {
      message: 'You are not a traveler',
    };
  }
};

module.exports = {
  createRequest,
  queryRequests,
  getRequestById,
  updateRequestById,
  deleteRequestById,
  sendrequest,
  userviewrequests,
  userviewrequest,
  acceptrequest,
  declinerequest,
  viewAllRequests,
  DeclineTrip,
  TravelerAcceptRequest,
  userAcceptTravelerRequest,
  viewTravelersRequests,
  viewRequestAfterAcceptance,
  ViewAllAcceptedRequests,
  checkout,
  checkoutWithPrice,
  filterRequestsByCity,
  getAceeptedRequests,
};
