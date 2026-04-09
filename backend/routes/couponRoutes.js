import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon
} from '../controllers/couponController.js';

const router = express.Router();

// Public (logged-in users)
router.post('/validate', protect, validateCoupon);

// Admin only
router.get('/', protect, admin, getAllCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id/toggle', protect, admin, toggleCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
