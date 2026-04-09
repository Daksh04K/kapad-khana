import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  uploadImage,
  getAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);
router.get('/users', protect, admin, getAllUsers);
router.post('/upload', protect, admin, upload.single('image'), uploadImage);
router.get('/analytics', protect, admin, getAnalytics);

export default router;
