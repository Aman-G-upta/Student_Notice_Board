const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const ApiError = require('./ApiError');

// Single place that loads a notice by id *and* the caller's college.
// A notice from another college behaves exactly like a notice that does not exist.
module.exports = async (noticeId, collegeId) => {
  if (!mongoose.isValidObjectId(noticeId)) throw new ApiError(404, 'Notice not found');
  const notice = await Notice.findOne({ _id: noticeId, collegeId });
  if (!notice) throw new ApiError(404, 'Notice not found');
  return notice;
};
