const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const ApiError = require('./ApiError');

const FOLDER = 'digital-college-notice-board/notices';

const uploadAttachment = (file) =>
  new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new ApiError(503, 'File uploads are not configured on the server. Add Cloudinary credentials.')
      );
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(new ApiError(502, 'Could not upload the attachment. Please try again.'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format || '',
          originalName: file.originalname,
          size: result.bytes,
        });
      }
    );
    stream.end(file.buffer);
  });

const deleteAttachment = async (attachment) => {
  if (!attachment || !attachment.publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(attachment.publicId, {
      resource_type: attachment.resourceType || 'image',
    });
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = { uploadAttachment, deleteAttachment };
