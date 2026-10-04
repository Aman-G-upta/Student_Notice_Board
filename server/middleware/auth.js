const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 1) Authentication: verifies the JWT and loads the user fresh from the database.
//    req.user.collegeId and req.user.role come from the DB, never from the client.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new ApiError(401, 'Please log in to continue');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Your session has expired. Please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'This account no longer exists');

  req.user = user;
  next();
});

// 2) Authorization: role-based access.
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do that'));
    }
    next();
  };

module.exports = { protect, authorize };
