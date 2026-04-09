import express from 'express';
import { createOrder, getMyOrders, getOrderById, createPayment, verifyPayment } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/payment/create', protect, createPayment);
router.post('/payment/verify', protect, verifyPayment);

export default router;
