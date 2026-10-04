const mongoose = require('mongoose');
const User = require('../models/User');
const College = require('../models/College');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { clean } = require('../utils/text');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const formatUser = (user, collegeDoc) => {
  const populated = collegeDoc || user.collegeId;
  const college = populated && populated.name ? populated : null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    createdAt: user.createdAt,
    college: college
      ? { id: college._id, name: college.name, code: college.code, address: college.address }
      : { id: user.collegeId },
  };
};

// GET /api/auth/config  (public)
exports.getConfig = (req, res) => {
  res.json({ facultyCodeRequired: Boolean(process.env.FACULTY_INVITE_CODE) });
};

// POST /api/auth/register  (public)
exports.register = asyncHandler(async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const role = clean(req.body.role);
  const collegeId = clean(req.body.collegeId);
  const department = clean(req.body.department);
  const facultyCode = clean(req.body.facultyCode);

  if (name.length < 2) throw new ApiError(400, 'Please enter your full name');
  if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Please enter a valid email address');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');
  if (!['student', 'faculty'].includes(role)) throw new ApiError(400, 'Please choose student or faculty');
  if (!mongoose.isValidObjectId(collegeId)) throw new ApiError(400, 'Please select your college');

  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(400, 'Selected college does not exist');

  if (role === 'faculty' && process.env.FACULTY_INVITE_CODE && facultyCode !== process.env.FACULTY_INVITE_CODE) {
    throw new ApiError(403, 'Invalid faculty invite code');
  }

  if (await User.findOne({ email })) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password, role, collegeId: college._id, department });

  res.status(201).json({ token: generateToken(user._id), user: formatUser(user, college) });
});

// POST /api/auth/login  (public)
exports.login = asyncHandler(async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password').populate('collegeId', 'name code address');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  res.json({ token: generateToken(user._id), user: formatUser(user) });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('collegeId', 'name code address');
  res.json({ user: formatUser(user) });
});

// PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const name = clean(req.body.name);
  const department = clean(req.body.department);
  if (name.length < 2) throw new ApiError(400, 'Please enter your full name');

  req.user.name = name;
  req.user.department = department;
  await req.user.save();

  const user = await User.findById(req.user._id).populate('collegeId', 'name code address');
  res.json({ user: formatUser(user) });
});
