const mongoose = require('mongoose');

const CATEGORIES = ['Academic', 'Examination', 'Placement', 'Events', 'Fees', 'General'];
const PRIORITIES = ['normal', 'important', 'urgent'];
const PRIORITY_RANK = { normal: 1, important: 2, urgent: 3 };

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 3, maxlength: 150 },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 5000,
    },
    category: { type: String, enum: { values: CATEGORIES, message: 'Invalid category' }, default: 'General' },
    priority: { type: String, enum: { values: PRIORITIES, message: 'Invalid priority' }, default: 'normal' },
    // Used only for sorting (urgent first). Always derived from `priority`.
    priorityRank: { type: Number, default: 1 },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachment: {
      url: String,
      publicId: String,
      resourceType: String,
      format: String,
      originalName: String,
      size: Number,
    },
  },
  { timestamps: true }
);

noticeSchema.pre('validate', function setRank(next) {
  this.priorityRank = PRIORITY_RANK[this.priority] || 1;
  next();
});

// Every list query is scoped by collegeId, so it leads the index.
noticeSchema.index({ collegeId: 1, priorityRank: -1, createdAt: -1 });
noticeSchema.index({ collegeId: 1, createdBy: 1, createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);
Notice.CATEGORIES = CATEGORIES;
Notice.PRIORITIES = PRIORITIES;

module.exports = Notice;
