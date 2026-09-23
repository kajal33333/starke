const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler('User not found', 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(new ErrorHandler('Not authorized, token failed', 401));
  }
};

module.exports = authMiddleware;