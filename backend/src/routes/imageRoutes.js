import express from 'express';

import {
  uploadImages,
  deleteImage,
} from '../controllers/imageController.js';

import { adminAuth } from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/upload',
  adminAuth,
  upload.array('images', 15),
  uploadImages
);

router.delete(
  '/',
  adminAuth,
  deleteImage
);

export default router;