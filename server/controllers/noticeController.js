const Notice = require('../models/Notice');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const findCollegeNotice = require('../utils/findCollegeNotice');
const { clean, escapeRegex } = require('../utils/text');
const { uploadAttachment, deleteAttachment } = require('../utils/uploadToCloudinary');

const withAuthor = (query) => query.populate('createdBy', 'name department');

// GET /api/notices?search=&category=&priority=&mine=true&page=&limit=
// The college filter ALWAYS comes from the authenticated user, never from the request.
exports.listNotices = asyncHandler(async (req, res) => {
  const filter = { collegeId: req.user.collegeId };

  const category = clean(req.query.category);
  const priority = clean(req.query.priority);
  const search = clean(req.query.search);

  if (Notice.CATEGORIES.includes(category)) filter.category = category;
  if (Notice.PRIORITIES.includes(priority)) filter.priority = priority;
  if (req.query.mine === 'true' && req.user.role === 'faculty') filter.createdBy = req.user._id;
  if (search) {
    const rx = new RegExp(escapeRegex(search.slice(0, 100)), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

  const [total, notices] = await Promise.all([
    Notice.countDocuments(filter),
    withAuthor(Notice.find(filter))
      .sort({ priorityRank: -1, createdAt: -1 }) // urgent first, then important, then latest
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  // Comment counts for the notices on this page (scoped to the same college).
  const counts = await Comment.aggregate([
    { $match: { collegeId: req.user.collegeId, noticeId: { $in: notices.map((n) => n._id) } } },
    { $group: { _id: '$noticeId', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  notices.forEach((n) => {
    n.commentCount = countMap.get(String(n._id)) || 0;
  });

  res.json({ notices, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/notices/:id
exports.getNotice = asyncHandler(async (req, res) => {
  await findCollegeNotice(req.params.id, req.user.collegeId); // 404 if it is not in the user's college
  const notice = await withAuthor(Notice.findById(req.params.id)).lean();
  res.json({ notice });
});

const validateFields = ({ title, description }) => {
  if (title.length < 3) throw new ApiError(400, 'Title must be at least 3 characters');
  if (title.length > 150) throw new ApiError(400, 'Title must be 150 characters or fewer');
  if (!description) throw new ApiError(400, 'Please add a description');
  if (description.length > 5000) throw new ApiError(400, 'Description must be 5000 characters or fewer');
};

// POST /api/notices  (faculty)
exports.createNotice = asyncHandler(async (req, res) => {
  const title = clean(req.body.title);
  const description = clean(req.body.description);
  const category = clean(req.body.category) || 'General';
  const priority = clean(req.body.priority) || 'normal';
  validateFields({ title, description });

  const attachment = req.file ? await uploadAttachment(req.file) : undefined;

  const notice = await Notice.create({
    title,
    description,
    category,
    priority,
    attachment,
    collegeId: req.user.collegeId, // from the authenticated user, not the request body
    createdBy: req.user._id,
  });

  res.status(201).json({ notice: await withAuthor(Notice.findById(notice._id)).lean() });
});

// Loads a notice in the user's college and makes sure the user is the one who created it.
const findOwnNotice = async (req) => {
  const notice = await findCollegeNotice(req.params.id, req.user.collegeId);
  if (!notice.createdBy.equals(req.user._id)) {
    throw new ApiError(403, 'You can only change notices that you created');
  }
  return notice;
};

// PUT /api/notices/:id  (faculty, owner)
exports.updateNotice = asyncHandler(async (req, res) => {
  const notice = await findOwnNotice(req);

  const title = req.body.title !== undefined ? clean(req.body.title) : notice.title;
  const description = req.body.description !== undefined ? clean(req.body.description) : notice.description;
  validateFields({ title, description });

  notice.title = title;
  notice.description = description;
  if (req.body.category !== undefined) notice.category = clean(req.body.category);
  if (req.body.priority !== undefined) notice.priority = clean(req.body.priority);

  const previous = notice.toObject().attachment;
  const oldAttachment = previous && previous.publicId ? previous : null;

  if (req.file) {
    notice.attachment = await uploadAttachment(req.file);
    await notice.save();
    await deleteAttachment(oldAttachment);
  } else if (req.body.removeAttachment === 'true' && oldAttachment) {
    notice.attachment = undefined;
    await notice.save();
    await deleteAttachment(oldAttachment);
  } else {
    await notice.save();
  }

  res.json({ notice: await withAuthor(Notice.findById(notice._id)).lean() });
});

// DELETE /api/notices/:id  (faculty, owner)
exports.deleteNotice = asyncHandler(async (req, res) => {
  const notice = await findOwnNotice(req);

  await deleteAttachment(notice.attachment);
  await Comment.deleteMany({ noticeId: notice._id, collegeId: req.user.collegeId });
  await notice.deleteOne();

  res.json({ message: 'Notice deleted' });
});
