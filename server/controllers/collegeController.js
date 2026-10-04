const College = require('../models/College');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/colleges  (public - needed on the registration screen)
exports.listColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find().sort({ name: 1 }).select('name code address');
  res.json({ colleges });
});
