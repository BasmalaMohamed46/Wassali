const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const passport = require('passport');
const googleAuth = require('../services/googleAuth');
const session = require('express-session');
const User = require('../models/user.model');
const sendEmail = require('./sendEmail');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Traveler = require('../models/traveler.model');
var redirectUrl
if(process.env.RUN_STATUS === 'local'){
  redirectUrl = 'localhost:3001'
}
else{
  redirectUrl = 'wasally.me'
}
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, res) => {
  const user = await userService.getUserByEmail(email);
  const traveler= await Traveler.findOne({
    userId: user._id
  })
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  // console.log(user.role);
  const payload = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  }
  if(traveler){
    if(traveler.isAdminVerificationPending){
      payload.travelerVerification = true;
  }else{
    payload.travelerVerification = false;
  }
  }

  const token = jwt.sign(payload,
    process.env.JWT_SECRET
  );
  // return user;
  res.json({
    message: 'user exist',
    token,
  });
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({
      user: user.id,
      type: tokenTypes.VERIFY_EMAIL,
    });
    await userService.updateUserById(user.id, {
      isEmailVerified: true,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const loginUserWithGoogle = async (req, res) => {
  const userExist = await User.findOne({
    email: req.user.email,
  });
  if (userExist) {
    // const token = await tokenService.generateAuthTokens(userExist._id)
    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
        name: userExist.name,
        email: userExist.email,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      message: 'user exist',
      user: req.user,
      token,
    });
  } else {
    const user = await User.create({
      name: req.user.displayName,
      email: req.user.email,
      // password: req.user.password,
      isEmailVerified: req.user.email_verified,
      googleId: req.user.id,
      profilePic: req.user.picture,
      phoneNumber: null,
    });
    // const token = await tokenService.generateAuthTokens(user._id)
    const token = jwt.sign(
      {
        id: user._id,
        user: user,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      message: 'user created',
      token,
    });
  }
};

const Googlefailure = (req, res) => {
  res.status(200).json({
    message: 'Google Login Failed',
  });
};
const googleCallback = async (req, res) => {
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/auth/failure',
  });
};

const Googlelogout = async (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'Email not found. Please enter a valid email.',
      });
    }
    const token = crypto.randomBytes(20).toString('hex');
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    const URL = `${req.protocol}://${redirectUrl}/resetPassword/${token}`;
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Dear ${user.name},</h2>
          <h3>You recently requested to reset your password.</h3>
          <p>To reset your password, please click on the following link:</p>
          <p><a href="${URL}" style="display:inline-block; background-color: #EE9E2F; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email and your account will remain unchanged.</p>
          <p>Thank you,</p>
          <p>Your App Team</p>
        </body>
      </html>
    `;
    sendEmail(email, message)
    return res.status(200).json({
      message: 'Email sent successfully. Please check your email.',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ token });
    if (!user) {
      res.status(404).json({
        message: 'This link has been expired',
      });
    } else {
      const { password } = req.body;
      user.password = password;
      user.token = '';
      await user.save();
      res.json({
        message: 'password updated successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  verifyEmail,
  loginUserWithGoogle,
  Googlefailure,
  googleCallback,
  Googlelogout,
  forgotPassword,
  resetPassword,
};
