const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User Not Found' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
    }
  }
  if (!token) {
    res.status(401).json({ message: 'User Not Authorize' });
  }
});
module.exports = { authMiddleware };
