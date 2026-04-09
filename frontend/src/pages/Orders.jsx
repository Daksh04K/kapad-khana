import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import { FiArrowLeft } from 'react-icons/fi';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <>
      <Breadcrumb />
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
      </>
    );
  }

  return (
    <div className="orders-page">
      <Breadcrumb />
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8)}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.product.images[0]}
                    alt={item.product.name}
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">+{order.items.length - 3}</div>
                )}
              </div>
              <div className="order-footer">
                <span className="order-total">Total: ₹{order.totalPrice}</span>
                <span className="order-payment">{order.paymentMethod}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
