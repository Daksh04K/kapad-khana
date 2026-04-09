import { Routes, Route } from 'react-router-dom';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import UsersManagement from './UsersManagement';
import CouponsManagement from './CouponsManagement';
import Analytics from './Analytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-content">
      <Routes>
        <Route path="/" element={<Analytics />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/products" element={<ProductsManagement />} />
        <Route path="/orders" element={<OrdersManagement />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/coupons" element={<CouponsManagement />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
