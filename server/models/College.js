const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'College name is required'], trim: true, unique: true },
  code: {
    type: String,
    required: [true, 'College code is required'],
    trim: true,
    uppercase: true,
    unique: true,
  },
  address: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('College', collegeSchema);
