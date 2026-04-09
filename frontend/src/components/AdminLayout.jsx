import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiLogOut, FiBarChart2, FiTrendingUp, FiTag, FiPieChart } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar-new">
        <div className="admin-brand">
          <div className="admin-logo">⚙️</div>
          <div className="admin-brand-text">
            <h2>Admin Panel</h2>
            <p>Kapad Khana</p>
          </div>
        </div>

        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="admin-user-details">
            <h4>{user?.name}</h4>
            <span className="admin-role-badge">Administrator</span>
          </div>
        </div>

        <nav className="admin-nav-new">
          <div className="nav-section">
            <h5 className="nav-section-title">MAIN MENU</h5>
            <Link to="/admin/analytics" className={`admin-nav-item ${location.pathname === '/admin' || isActive('/admin/analytics') ? 'active' : ''}`}>
              <FiPieChart /> <span>Analytics</span>
            </Link>
            <Link to="/admin/products" className={`admin-nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
              <FiPackage /> <span>Products</span>
            </Link>
            <Link to="/admin/orders" className={`admin-nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
              <FiShoppingCart /> <span>Orders</span>
            </Link>
            <Link to="/admin/users" className={`admin-nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
              <FiUsers /> <span>Users</span>
            </Link>
            <Link to="/admin/coupons" className={`admin-nav-item ${isActive('/admin/coupons') ? 'active' : ''}`}>
              <FiTag /> <span>Coupons</span>
            </Link>
          </div>

          <div className="nav-section">
            <h5 className="nav-section-title">SHOPPING</h5>
            <Link to="/products" className="admin-nav-item">
              <FiTrendingUp /> <span>Browse Products</span>
            </Link>
            <Link to="/cart" className="admin-nav-item">
              <FiShoppingCart /> <span>My Cart</span>
            </Link>
            <Link to="/orders" className="admin-nav-item">
              <FiBarChart2 /> <span>My Orders</span>
            </Link>
          </div>

          <div className="nav-section">
            <h5 className="nav-section-title">ACCOUNT</h5>
            <Link to="/profile" className="admin-nav-item">
              <FiSettings /> <span>Profile Settings</span>
            </Link>
            <button onClick={handleLogout} className="admin-nav-item logout-btn">
              <FiLogOut /> <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
