import express from 'express';

import {
  getApartments,
  getApartmentById,
  getDistricts,
  getAllApartmentsAdmin,
  createApartment,
  updateApartment,
  deleteApartment,
  updateAvailability,
} from '../controllers/apartmentController.js';

import { adminAuth } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ==============================
// PUBLIC
// ==============================

router.get('/', getApartments);

router.get('/districts', getDistricts);

// ==============================
// ADMIN
// ==============================

router.get(
  '/admin/all',
  adminAuth,
  getAllApartmentsAdmin
);

router.post('/', adminAuth, createApartment);

router.put('/:id', adminAuth, updateApartment);

router.delete('/:id', adminAuth, deleteApartment);

router.patch(
  '/:id/availability',
  adminAuth,
  updateAvailability
);

// ==============================
// PUBLIC DETAIL
// ==============================

router.get('/:id', getApartmentById);

export default router;