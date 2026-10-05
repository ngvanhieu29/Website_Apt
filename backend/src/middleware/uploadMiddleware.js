import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ được upload file ảnh'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    files: 15,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;