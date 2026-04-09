import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCalendar, FiShoppingBag, FiHeart, FiSettings, FiShield } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: orders } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const { data: wishlist } = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlist.products?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await axios.put('/api/auth/profile', updateData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      updateUser(data);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar">
                <FiUser size={32} />
              </div>
              <h2>{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="profile-admin-badge">
                  <FiShield size={12} /> Administrator
                </span>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <FiShoppingBag size={18} />
                <div>
                  <span className="stat-value">{stats.totalOrders}</span>
                  <span className="stat-label">Orders</span>
                </div>
              </div>
              <div className="stat-item">
                <FiHeart size={18} />
                <div>
                  <span className="stat-value">{stats.wishlistCount}</span>
                  <span className="stat-label">Wishlist</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-currency">₹</span>
                <div>
                  <span className="stat-value">{stats.totalSpent.toLocaleString()}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div>
            </div>

            <div className="profile-menu">
              <button
                className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser /> Personal Information
              </button>
              <button
                className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FiLock /> Security Settings
              </button>
              <Link to="/orders" className="menu-item">
                <FiShoppingBag /> My Orders
              </Link>
              <Link to="/wishlist" className="menu-item">
                <FiHeart /> My Wishlist
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="menu-item admin-link">
                  <FiSettings /> Admin Dashboard
                </Link>
              )}
            </div>

            <div className="profile-logout">
              <button onClick={() => {
                logout();
                navigate('/');
              }} className="logout-btn">
                🚪 Logout
              </button>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <FiCalendar size={14} />
                <span>Member since {formatDate(user?.createdAt || new Date())}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="content-section">
                <h3>Personal Information</h3>
                <p className="section-description">Update your personal details and contact information</p>
                
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label><FiUser size={14} /> Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label><FiMail size={14} /> Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label><FiPhone size={14} /> Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="content-section">
                <h3>Security Settings</h3>
                <p className="section-description">Manage your password and account security</p>
                
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="security-info">
                    <FiShield size={20} />
                    <div>
                      <h4>Change Password</h4>
                      <p>Choose a strong password to keep your account secure</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label><FiLock size={14} /> New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        minLength="6"
                      />
                      <small>Leave blank to keep your current password</small>
                    </div>
                  </div>

                  {formData.password && (
                    <div className="form-row">
                      <div className="input-group">
                        <label><FiLock size={14} /> Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your new password"
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={loading || !formData.password}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div className="security-tips">
                  <h4>Password Tips:</h4>
                  <ul>
                    <li>Use at least 6 characters</li>
                    <li>Include numbers and special characters</li>
                    <li>Don't use common words or personal information</li>
                    <li>Change your password regularly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
