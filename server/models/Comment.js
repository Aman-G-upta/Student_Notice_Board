const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  text: { type: String, required: [true, 'Comment cannot be empty'], trim: true, minlength: 1, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.index({ noticeId: 1, collegeId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
