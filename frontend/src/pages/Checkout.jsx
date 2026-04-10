import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiTag, FiX, FiCheck } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code');
    setCouponLoading(true);
    try {
      const { data } = await axios.post(
        '/api/coupons/validate',
        { code: couponCode.trim(), orderAmount: subtotal },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAppliedCoupon(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price
        })),
        shippingAddress: formData,
        paymentMethod,
        totalPrice: finalTotal,
        couponId: appliedCoupon?.couponId || null,
        discount
      };

      if (paymentMethod === 'Online') {
        toast.info('Processing payment... (Demo Mode)', { autoClose: 2000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { data: paymentData } = await axios.post(
          '/api/orders/payment/create',
          { amount: finalTotal },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const { data: verifyData } = await axios.post(
          '/api/orders/payment/verify',
          { order_id: paymentData.id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (verifyData.success) {
          orderData.paymentId = verifyData.paymentId;
          const { data: order } = await axios.post('/api/orders', orderData, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          await clearCart();
          toast.success('Payment successful! (Demo Mode)');
          navigate(`/order-success/${order._id}`);
        }
      } else {
        const { data: order } = await axios.post('/api/orders', orderData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        await clearCart();
        navigate(`/order-success/${order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <Breadcrumb />
      <div className="container">
        <button className="back-button" onClick={() => navigate('/cart')}>
          <FiArrowLeft /> Back to Cart
        </button>
        <h1>Checkout</h1>
        <div className="checkout-content">

          {/* Left: Shipping + Payment */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-group">
                <label>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input type="radio" value="Online" checked={paymentMethod === 'Online'} onChange={e => setPaymentMethod(e.target.value)} />
                  <span>Online Payment (Demo)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : `Place Order · ₹${finalTotal}`}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.items.map(item => (
                <div key={item._id} className="summary-item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div className="item-info">
                    <p>{item.product.name}</p>
                    <p>Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="coupon-section">
              <h3><FiTag /> Apply Coupon</h3>
              {!appliedCoupon ? (
                <div className="coupon-input-row">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                  />
                  <button type="button" className="btn btn-outline apply-btn" onClick={handleApplyCoupon} disabled={couponLoading}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <FiCheck className="check-icon" />
                  <div>
                    <span className="coupon-code-tag">{appliedCoupon.code}</span>
                    <span className="coupon-savings">You save ₹{appliedCoupon.discount}</span>
                  </div>
                  <button type="button" className="remove-coupon" onClick={handleRemoveCoupon}>
                    <FiX />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="price-row discount-row">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="price-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="price-row total-row">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
              {discount > 0 && (
                <div className="savings-banner">
                  🎉 You're saving ₹{discount} on this order!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
