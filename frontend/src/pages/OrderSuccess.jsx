import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    // Confetti animation or success animation can be added here
  }, []);

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <FiCheckCircle />
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Your order has been placed successfully.</p>
        <p className="order-id">Order ID: {id}</p>
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
          <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
