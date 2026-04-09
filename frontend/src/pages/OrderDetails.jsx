import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import './OrderDetails.css';

const STEPS = [
  { key: 'Pending',          label: 'Order Placed',      icon: <FiShoppingBag />,  desc: 'Your order has been received' },
  { key: 'Confirmed',        label: 'Confirmed',         icon: <FiCheckCircle />,  desc: 'Order confirmed by seller' },
  { key: 'Shipped',          label: 'Shipped',           icon: <FiPackage />,      desc: 'Package is on its way' },
  { key: 'Out for Delivery', label: 'Out for Delivery',  icon: <FiTruck />,        desc: 'Arriving today' },
  { key: 'Delivered',        label: 'Delivered',         icon: <FiMapPin />,       desc: 'Package delivered' },
];

const statusColor = {
  Pending:          '#f59e0b',
  Confirmed:        '#3b82f6',
  Shipped:          '#8b5cf6',
  'Out for Delivery': '#f97316',
  Delivered:        '#10b981',
  Cancelled:        '#ef4444',
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (stepKey) => {
    if (order.orderStatus === 'Cancelled') return stepKey === 'Pending' ? 'done' : 'cancelled';
    const stepIndex  = STEPS.findIndex(s => s.key === stepKey);
    const orderIndex = STEPS.findIndex(s => s.key === order.orderStatus);
    if (stepIndex < orderIndex)  return 'done';
    if (stepIndex === orderIndex) return 'active';
    return 'pending';
  };

  const getStepTimestamp = (stepKey) => {
    if (!order.statusHistory) return null;
    const entry = [...order.statusHistory].reverse().find(h => h.status === stepKey);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!order)  return <div className="error-message">Order not found</div>;

  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="order-details-page">
      <Breadcrumb />
      <div className="container">
        <button className="back-button" onClick={() => navigate('/orders')}>
          <FiArrowLeft /> Back to Orders
        </button>

        <div className="order-details-header">
          <div>
            <h1>Order Details</h1>
            <p className="order-id-text">Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
          </div>
          <span className="order-status-pill" style={{ background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus], border: `1px solid ${statusColor[order.orderStatus]}44` }}>
            {order.orderStatus}
          </span>
        </div>

        {/* ── TRACKING TIMELINE ── */}
        {!isCancelled ? (
          <div className="tracking-card">
            <h2>Order Tracking</h2>
            <div className="timeline">
              {STEPS.map((step, idx) => {
                const state = getStepState(step.key);
                const ts    = getStepTimestamp(step.key);
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={step.key} className={`timeline-step ${state}`}>
                    {/* connector line */}
                    {!isLast && <div className={`timeline-line ${state === 'done' ? 'done' : ''}`} />}

                    <div className="step-icon-wrap">
                      <div className="step-icon">{step.icon}</div>
                    </div>
                    <div className="step-content">
                      <span className="step-label">{step.label}</span>
                      <span className="step-desc">{ts || step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="cancelled-banner">
            <FiXCircle size={20} />
            <div>
              <strong>Order Cancelled</strong>
              <p>This order has been cancelled.</p>
            </div>
          </div>
        )}

        <div className="order-details-content">
          {/* Left column */}
          <div className="order-info-section">
            <div className="info-card">
              <h2>Order Information</h2>
              <div className="info-row"><span>Order ID</span><span>#{order._id.slice(-8).toUpperCase()}</span></div>
              <div className="info-row"><span>Date</span><span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="info-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
              <div className="info-row">
                <span>Payment Status</span>
                <span className={`pay-badge ${order.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>{order.paymentStatus}</span>
              </div>
              {order.discount > 0 && (
                <div className="info-row discount-info">
                  <span>Coupon Discount</span>
                  <span>- ₹{order.discount}</span>
                </div>
              )}
            </div>

            <div className="info-card">
              <h2>Shipping Address</h2>
              <p className="addr-name">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="info-card">
                <h2>Status History</h2>
                <div className="history-list">
                  {[...order.statusHistory].reverse().map((entry, i) => (
                    <div key={i} className="history-item">
                      <div className="history-dot" style={{ background: statusColor[entry.status] || '#d4af37' }} />
                      <div>
                        <span className="history-status">{entry.status}</span>
                        {entry.note && <span className="history-note"> — {entry.note}</span>}
                        <span className="history-time">
                          {new Date(entry.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: items */}
          <div className="order-items-section">
            <h2>Order Items</h2>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <Link to={`/products/${item.product._id}`}>
                  <img src={item.product.images[0]} alt={item.product.name} />
                </Link>
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>Size: {item.size}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.price} each</p>
                </div>
                <div className="item-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
            <div className="order-total-breakdown">
              {order.discount > 0 && (
                <>
                  <div className="total-row-sm">
                    <span>Subtotal</span>
                    <span>₹{order.totalPrice + order.discount}</span>
                  </div>
                  <div className="total-row-sm discount-row">
                    <span>Coupon Discount</span>
                    <span>- ₹{order.discount}</span>
                  </div>
                </>
              )}
              <div className="order-total">
                <span>Total Amount</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
