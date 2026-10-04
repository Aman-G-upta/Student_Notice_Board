const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Notice = require('../models/Notice');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const findCollegeNotice = require('../utils/findCollegeNotice');
const { clean } = require('../utils/text');

// GET /api/notices/:id/comments
exports.listComments = asyncHandler(async (req, res) => {
  const notice = await findCollegeNotice(req.params.id, req.user.collegeId);

  const comments = await Comment.find({ noticeId: notice._id, collegeId: req.user.collegeId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name role')
    .lean();

  const result = comments.map((c) => ({
    _id: c._id,
    text: c.text,
    createdAt: c.createdAt,
    user: c.userId ? { _id: c.userId._id, name: c.userId.name, role: c.userId.role } : null,
    canDelete: Boolean(
      c.userId &&
        (String(c.userId._id) === String(req.user._id) ||
          (req.user.role === 'faculty' && String(notice.createdBy) === String(req.user._id)))
    ),
  }));

  res.json({ comments: result });
});

// POST /api/notices/:id/comments
exports.addComment = asyncHandler(async (req, res) => {
  const notice = await findCollegeNotice(req.params.id, req.user.collegeId);

  const text = clean(req.body.text);
  if (!text) throw new ApiError(400, 'Comment cannot be empty');
  if (text.length > 500) throw new ApiError(400, 'Comments can be up to 500 characters');

  const comment = await Comment.create({
    noticeId: notice._id,
    userId: req.user._id,
    collegeId: req.user.collegeId,
    text,
  });

  res.status(201).json({
    comment: {
      _id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      canDelete: true,
    },
  });
});

// DELETE /api/comments/:id
exports.deleteComment = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Comment not found');

  const comment = await Comment.findOne({ _id: req.params.id, collegeId: req.user.collegeId });
  if (!comment) throw new ApiError(404, 'Comment not found');

  const notice = await Notice.findOne({ _id: comment.noticeId, collegeId: req.user.collegeId });
  const isAuthor = comment.userId.equals(req.user._id);
  const isNoticeOwner = Boolean(notice) && req.user.role === 'faculty' && notice.createdBy.equals(req.user._id);

  if (!isAuthor && !isNoticeOwner) throw new ApiError(403, 'You cannot delete this comment');

  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
});
