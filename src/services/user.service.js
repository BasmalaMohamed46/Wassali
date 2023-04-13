const QRCode = require('qrcode')
const httpStatus = require('http-status');
const {
  User
} = require('../models');
const ApiError = require('../utils/ApiError');
const Request = require('../models/request.model');
const Traveler = require('../models/traveler.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // if (await User.isphoneNumberTaken(userBody.phoneNumber)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'PhoneNumber already registered');
  // }
  // console.log(userBody)
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({
    email
  });
};

/**
 * Get user by phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const getUserByphoneNumber = async (phoneNumber) => {
  return User.findOne({ phoneNumber });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody,req) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }


  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };
const profileImage = async (id,req) => {
  const user = await User.findById(id);
  if (req.fileUploadError) {
    return {
      message: 'invalid file, accepted files->(png,jpg,jpeg)',
    }
  }
  if(!user){
    return {
      message: 'user not found',
    }
  }
  else{
    let ProfileImage_URL = `${req.protocol}://${req.headers.host}/${req.destination4}/${req.files.ProfileImage[0].filename}`;
    // const updated=await User.findByIdAndUpdate(id, {profileImage:ProfileImage_URL}, {new: true});
    // return updated;
    user.ProfileImage=ProfileImage_URL;
    await user.save();
    return user;

  }
  }
  const getAllUserss = async () => {
    return User.find();
  };

  const qrCode = async (id,req,res) => {
      const user=await User.findById(id);
      if(!user){
       res.httpStatus(404).send('user not found')
      }
      else{
        QRCode.toDataURL(`${req.protocol}://${req.headers.host}/v1/users/qrCodeScan/${id}`, function (err, url) {
          if(err){
           res.httpStatus(500).send(err)
          }
          else{
            user.qrCode=url;
            user.save();
            res.status(httpStatus.OK).send(user)
          }
        })
      }

  }

  const updateToDeliveredFromQR =async (id,req,res,userId)=>{
    const travelerExist = await Traveler.findOne({
      userId:id
    });
    const userExist = await User.findById(userId);
    if(travelerExist){
      if(userExist){
        if(userExist.requests.length>0){
          const lastRequest=userExist.requests[userExist.requests.length-1];
          const foundedRequest = await Request.findById(lastRequest);
          if(foundedRequest.state==='onmyway'){
            foundedRequest.state='delivered';
            foundedRequest.save();
            res.status(httpStatus.OK).send(foundedRequest)
          }
          else{
            res.status(httpStatus.BAD_REQUEST).send('request already delivered')
          }
        }
        else{
          res.status(httpStatus.BAD_REQUEST).send('no request found')
        }
      }
      else{
        res.status(httpStatus.BAD_REQUEST).send('user not found')
      }
    }
    else{
      res.status(httpStatus.BAD_REQUEST).send('traveler not found')
    }
  }

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  // deleteUserById,
  getUserByphoneNumber,
  profileImage,
  getAllUserss,
  qrCode,
  updateToDeliveredFromQR
};
