import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProductReviews,
  addReview,
  markHelpful,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', protect, addReview);
router.put('/:reviewId/helpful', protect, markHelpful);
router.delete('/:reviewId', protect, deleteReview);

export default router;
