import Coupon from '../models/Coupon.js';

// ── Public: validate a coupon code ──────────────────────────────────────────
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon)          return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
                          return res.status(400).json({ message: 'This coupon has expired' });
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
                          return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount)
                          return res.status(400).json({
                            message: `Minimum order amount is ₹${coupon.minOrderAmount}`
                          });

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((orderAmount * coupon.value) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.value, orderAmount); // flat can't exceed order total
    }

    res.json({
      valid: true,
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message: coupon.type === 'percentage'
        ? `${coupon.value}% off applied! You save ₹${discount}`
        : `Flat ₹${discount} off applied!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: get all coupons ───────────────────────────────────────────────────
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: create coupon ─────────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase().trim()
    });
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: toggle active status ──────────────────────────────────────────────
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: delete coupon ─────────────────────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Internal: increment usedCount (called from orderController) ──────────────
export const incrementCouponUsage = async (couponId) => {
  if (couponId) await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
};
