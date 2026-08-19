import express from 'express';
import {
  getApartments,
  getApartmentById,
  getDistricts,
} from '../controllers/apartmentController.js';

const router = express.Router();

router.get('/', getApartments);
router.get('/districts', getDistricts);
router.get('/:id', getApartmentById);

export default router;
