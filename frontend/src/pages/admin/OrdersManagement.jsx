import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColor = {
  Pending:            { bg: '#fef3c7', color: '#d97706' },
  Confirmed:          { bg: '#dbeafe', color: '#2563eb' },
  Shipped:            { bg: '#ede9fe', color: '#7c3aed' },
  'Out for Delivery': { bg: '#ffedd5', color: '#ea580c' },
  Delivered:          { bg: '#dcfce7', color: '#16a34a' },
  Cancelled:          { bg: '#fee2e2', color: '#dc2626' },
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(
        `/api/admin/orders/${orderId}`,
        { orderStatus: newStatus, note: '' },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Status updated to "${newStatus}"`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Orders Management</h1>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{orders.length} total orders</span>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const sc = statusColor[order.orderStatus] || { bg: '#f3f4f6', color: '#374151' };
              return (
                <tr key={order._id}>
                  <td style={{ fontWeight: 700, letterSpacing: '0.5px', fontSize: 11 }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{order.user?.name}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontSize: 11 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalPrice}</td>
                  <td style={{ fontSize: 11 }}>{order.paymentMethod}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      background: sc.bg,
                      color: sc.color
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      disabled={updating === order._id}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #e5e7eb',
                        fontSize: 11,
                        cursor: 'pointer',
                        background: 'white',
                        minWidth: 140
                      }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManagement;
