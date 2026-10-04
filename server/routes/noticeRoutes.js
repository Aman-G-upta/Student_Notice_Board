const express = require('express');
const {
  listNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { listComments, addComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Every notice route requires a logged-in user.
router.use(protect);

router.get('/', listNotices);
router.post('/', authorize('faculty'), upload, createNotice);

router.get('/:id', getNotice);
router.put('/:id', authorize('faculty'), upload, updateNotice);
router.delete('/:id', authorize('faculty'), deleteNotice);

router.get('/:id/comments', listComments);
router.post('/:id/comments', addComment);

module.exports = router;
