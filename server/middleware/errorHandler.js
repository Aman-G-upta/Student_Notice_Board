const multer = require('multer');

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Maximum size is 5 MB' : err.message;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)[0]?.message || 'Invalid data';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  } else if (err.code === 11000) {
    status = 409;
    message = 'That value is already in use';
  } else if (!err.isOperational && status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Something went wrong on our side';
  }

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
