import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { incrementCouponUsage } from './couponController.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice, paymentId, couponId, discount } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      couponId: couponId || null,
      discount: discount || 0,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      statusHistory: [{ status: 'Pending', note: 'Order placed successfully' }]
    });

    // Increment coupon usage if applied
    if (couponId) await incrementCouponUsage(couponId);

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (order && order.user.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create fake payment (Demo for university project)
export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    // Simulate payment gateway response
    const fakePaymentOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      status: 'created'
    };

    res.json(fakePaymentOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify fake payment (Demo for university project)
export const verifyPayment = async (req, res) => {
  try {
    // Simulate successful payment verification
    const fakePaymentId = `pay_${Date.now()}`;
    
    res.json({ 
      success: true, 
      paymentId: fakePaymentId,
      message: 'Payment verified successfully (Demo Mode)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
