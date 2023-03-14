const jwt = require('jsonwebtoken');
const User = require('../models/user.model')
const auth = () => {
  return (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || authorization == null || authorization == undefined || !authorization.startsWith('Bearer ')) {
      res.status(401).json({
        message: "you are not authorized",
      })
    } else {
      const decodedToken = req.headers.authorization.split(' ')[1];
      jwt.verify(decodedToken, process.env.JWT_SECRET, async function (err, decoded) {
        if (decoded) {
          let userData = await User.findById(decoded.id);
          if (userData) {
            if (userData.isAdmin || !userData.isDeleted) {
              req.user = userData;
              next()
            } else {
              res.status(401).json({
                message: "you are not authorized",
              })
            }
          } else {
            res.status(404).json({
              message: "User Not Exist",
            })
          }
        } else {
          res.json({
            message: "invalid token"
          })
        }
      })
    }
  }
}
module.exports = auth;
