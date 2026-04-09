import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// One-time seed route - creates admin + coupons
// DELETE THIS FILE after first use in production
router.get('/init', async (req, res) => {
  try {
    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@kapadkhana.com' });
    if (existing) {
      return res.json({ message: 'Already seeded', admin: 'admin@kapadkhana.com' });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@kapadkhana.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@kapadkhana.com',
      password: userPassword,
      role: 'user'
    });

    // Create coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany([
      { code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 0,    maxDiscount: 200,  isActive: true },
      { code: 'SAVE20',    type: 'percentage', value: 20, minOrderAmount: 999,  maxDiscount: 500,  isActive: true },
      { code: 'FLAT100',   type: 'flat',       value: 100, minOrderAmount: 599, isActive: true },
      { code: 'FLAT200',   type: 'flat',       value: 200, minOrderAmount: 1499, isActive: true },
      { code: 'ETHNIC50',  type: 'percentage', value: 50, minOrderAmount: 1999, maxDiscount: 1000, isActive: true },
    ]);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      admin: 'admin@kapadkhana.com / admin123',
      user: 'user@kapadkhana.com / user123',
      coupons: ['WELCOME10', 'SAVE20', 'FLAT100', 'FLAT200', 'ETHNIC50']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
