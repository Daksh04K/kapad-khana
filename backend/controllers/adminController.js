import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// ── Analytics ────────────────────────────────────────────────────────────────
export const getAnalytics = async (req, res) => {
  try {
    const [orders, users, products] = await Promise.all([
      Order.find({}).populate('items.product', 'name category price'),
      User.find({}).select('createdAt role'),
      Product.find({}).select('name category stock price rating numReviews')
    ]);

    // ── Summary cards ──
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((s, o) => s + o.totalPrice, 0);

    const totalOrders   = orders.length;
    const totalUsers    = users.filter(u => u.role !== 'admin').length;
    const totalProducts = products.length;

    // ── Revenue last 7 days ──
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd   = new Date(d.setHours(23, 59, 59, 999));
      const revenue  = orders
        .filter(o => o.orderStatus !== 'Cancelled' && new Date(o.createdAt) >= dayStart && new Date(o.createdAt) <= dayEnd)
        .reduce((s, o) => s + o.totalPrice, 0);
      const count = orders.filter(o => new Date(o.createdAt) >= dayStart && new Date(o.createdAt) <= dayEnd).length;
      revenueByDay.push({ label, revenue, orders: count });
    }

    // ── Orders by status ──
    const statusCounts = {};
    orders.forEach(o => { statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1; });
    const ordersByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // ── Revenue by category ──
    const catRevenue = {};
    orders.filter(o => o.orderStatus !== 'Cancelled').forEach(o => {
      o.items.forEach(item => {
        const cat = item.product?.category || 'Other';
        catRevenue[cat] = (catRevenue[cat] || 0) + (item.price * item.quantity);
      });
    });
    const revenueByCategory = Object.entries(catRevenue)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // ── Top 5 products by revenue ──
    const productRevenue = {};
    orders.filter(o => o.orderStatus !== 'Cancelled').forEach(o => {
      o.items.forEach(item => {
        const pid = item.product?._id?.toString();
        const name = item.product?.name || 'Unknown';
        if (!pid) return;
        if (!productRevenue[pid]) productRevenue[pid] = { name, revenue: 0, units: 0 };
        productRevenue[pid].revenue += item.price * item.quantity;
        productRevenue[pid].units   += item.quantity;
      });
    });
    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // ── New users last 7 days ──
    const usersByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label    = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd   = new Date(d.setHours(23, 59, 59, 999));
      const count    = users.filter(u => new Date(u.createdAt) >= dayStart && new Date(u.createdAt) <= dayEnd).length;
      usersByDay.push({ label, users: count });
    }

    // ── Low stock products ──
    const lowStock = products
      .filter(p => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)
      .map(p => ({ name: p.name, stock: p.stock, category: p.category }));

    res.json({
      summary: { totalRevenue, totalOrders, totalUsers, totalProducts },
      revenueByDay,
      ordersByStatus,
      revenueByCategory,
      topProducts,
      usersByDay,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || ''
    });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'kapad-khana'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
