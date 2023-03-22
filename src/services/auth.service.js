const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const {
  tokenTypes
} = require('../config/tokens');
const passport = require('passport')
const googleAuth = require('../services/googleAuth')
const session = require('express-session')
const User = require('../models/user.model')

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, res) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  const token = jwt.sign({
    id: user._id,
    user: user,
  },
    process.env.JWT_SECRET)
  // return user;
  res.json({
    message: 'user exist',
    token
  })
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
    blacklisted: false
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
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, {
      password: newPassword
    });
    await Token.deleteMany({
      user: user.id,
      type: tokenTypes.RESET_PASSWORD
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

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
      type: tokenTypes.VERIFY_EMAIL
    });
    await userService.updateUserById(user.id, {
      isEmailVerified: true
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const loginUserWithGoogle = async (req, res) => {
  const userExist = await User.findOne({
    email: req.user.email
  })
  if (userExist) {
    // const token = await tokenService.generateAuthTokens(userExist._id)
    const token = jwt.sign({
      id: userExist._id,
      user: userExist,
    }, process.env.JWT_SECRET)
    res.status(200).json({
      message: 'user exist',
      user: req.user,
      token
    })
  } else {
    const user = await User.create({
      name: req.user.displayName,
      email: req.user.email,
      // password: req.user.password,
      isEmailVerified: req.user.email_verified,
      googleId: req.user.id,
      profilePic: req.user.picture,
    })
    // const token = await tokenService.generateAuthTokens(user._id)
    const token = jwt.sign({
      id: user._id,
      user: user
    }, process.env.JWT_SECRET)
    res.status(200).json({
      message: 'user created',
      token
    })
  }
}

const Googlefailure = (req, res) => {
  res.status(200).json({
    message: 'Google Login Failed'
  })
}
const googleCallback = async (req, res) => {
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/auth/failure'
  })
}

const Googlelogout = async (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginUserWithGoogle,
  Googlefailure,
  googleCallback,
  Googlelogout

};
