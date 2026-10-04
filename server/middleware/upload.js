const multer = require('multer');
const ApiError = require('../utils/ApiError');

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

// Files are held in memory and streamed straight to Cloudinary (nothing is written to disk).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new ApiError(400, 'Only PDF, JPG, PNG or WEBP files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = upload.single('attachment');
