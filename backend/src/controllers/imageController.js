import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'apartment-rental',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'Vui lòng chọn ít nhất một ảnh',
      });
    }

    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file))
    );

    const images = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.status(201).json({
      message: 'Upload ảnh thành công',
      images,
    });
  } catch (error) {
    console.error('UPLOAD IMAGES ERROR:', error);

    res.status(500).json({
      message: error.message || 'Upload ảnh thất bại',
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        message: 'Thiếu publicId',
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      message: 'Xóa ảnh thành công',
    });
  } catch (error) {
    console.error('DELETE IMAGE ERROR:', error);

    res.status(500).json({
      message: error.message || 'Xóa ảnh thất bại',
    });
  }
};