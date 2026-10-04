const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 80 },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'faculty'], required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
  department: { type: String, trim: true, maxlength: 80, default: '' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
