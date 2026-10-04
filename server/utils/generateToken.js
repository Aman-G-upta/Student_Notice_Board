const jwt = require('jsonwebtoken');

// The token only carries the user id. collegeId and role are always re-read
// from the database on each request, so they can never be spoofed.
module.exports = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
