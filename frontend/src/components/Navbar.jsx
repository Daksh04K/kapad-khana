import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ThemeContext } from '../context/ThemeContext';
import { FiSearch, FiMenu, FiX, FiClock, FiTrendingUp, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const MAX_RECENT = 5;

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(stored);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);

    // Debounce API call
    clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const { data } = await axios.get(`/api/products/search?q=${value}`);
          setSuggestions(data.slice(0, 6));
        } catch {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  const saveRecentSearch = (query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate(`/products?search=${searchQuery.trim()}`);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (product) => {
    saveRecentSearch(product.name);
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/products/${product._id}`);
  };

  const handleRecentClick = (term) => {
    setSearchQuery(term);
    setShowDropdown(false);
    navigate(`/products?search=${term}`);
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/');
  };

  const showRecents = showDropdown && searchQuery.length === 0 && recentSearches.length > 0;
  const showSuggestions = showDropdown && suggestions.length > 0;
  const showNoResults = showDropdown && searchQuery.length >= 2 && suggestions.length === 0;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-top">
          <div className="navbar-container">
            {/* LEFT: Logo */}
            <Link to="/" className="navbar-logo">
              <span className="logo-icon">🛍️</span>
              KAPAD KHANA
            </Link>

            {/* CENTER: Search Bar with Autocomplete */}
            <div className="navbar-search-wrapper" ref={searchRef}>
              <form className="navbar-search" onSubmit={handleSearch}>
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                  >
                    <FiX />
                  </button>
                )}
                <button type="submit" className="search-btn">Search</button>
              </form>

              {/* Autocomplete Dropdown */}
              {(showRecents || showSuggestions || showNoResults) && (
                <div className="search-dropdown">
                  {/* Recent Searches */}
                  {showRecents && (
                    <div className="dropdown-section">
                      <div className="dropdown-section-header">
                        <span><FiClock /> Recent Searches</span>
                        <button onClick={clearRecentSearches}>Clear</button>
                      </div>
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          className="dropdown-item recent-item"
                          onClick={() => handleRecentClick(term)}
                        >
                          <FiClock className="item-icon" />
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Suggestions */}
                  {showSuggestions && (
                    <div className="dropdown-section">
                      <div className="dropdown-section-header">
                        <span><FiTrendingUp /> Suggestions</span>
                      </div>
                      {suggestions.map(product => (
                        <div
                          key={product._id}
                          className="dropdown-item suggestion-item"
                          onClick={() => handleSuggestionClick(product)}
                        >
                          <img src={product.images[0]} alt={product.name} className="suggestion-img" />
                          <div className="suggestion-info">
                            <span className="suggestion-name">{product.name}</span>
                            <span className="suggestion-price">₹{product.price}</span>
                          </div>
                          {product.discount > 0 && (
                            <span className="suggestion-badge">{product.discount}% OFF</span>
                          )}
                        </div>
                      ))}
                      <div
                        className="dropdown-view-all"
                        onClick={() => { saveRecentSearch(searchQuery); navigate(`/products?search=${searchQuery}`); setShowDropdown(false); setSearchQuery(''); }}
                      >
                        View all results for "{searchQuery}"
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {showNoResults && (
                    <div className="dropdown-no-results">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: Nav Links */}
            <div className="navbar-links">
              <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                {isDark ? <FiSun /> : <FiMoon />}
              </button>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/cart" className="nav-link cart-link">
                Cart
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="nav-link user-link">
                    Profile
                    {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="nav-link admin-panel-link">Admin Panel</Link>
                  )}
                </>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
              <button className="navbar-hamburger" onClick={() => setSidebarOpen(true)}>
                <FiMenu />
              </button>
            </div>
          </div>
        </div>

        <div className="navbar-categories">
          <div className="categories-container">
            <Link to="/products" className="category-item">All Products</Link>
            <Link to="/products?category=men" className="category-item">Men</Link>
            <Link to="/products?category=women" className="category-item">Women</Link>
            <Link to="/products?category=kids" className="category-item">Kids</Link>
            <Link to="/products?category=accessories" className="category-item">Accessories</Link>
            <Link to="/products?category=footwear" className="category-item">Footwear</Link>
            <Link to="/products?category=ethnic" className="category-item">Ethnic Wear</Link>
            <Link to="/products?category=western" className="category-item">Western Wear</Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <h3>Menu</h3>
            {user && <p className="sidebar-user">Hello, {user.name}</p>}
          </div>
          <button onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>
        <div className="sidebar-links">
          <Link to="/" onClick={() => setSidebarOpen(false)}>🏠 Home</Link>
          <Link to="/products" onClick={() => setSidebarOpen(false)}>🛍️ Products</Link>
          {user && (
            <>
              <Link to="/wishlist" onClick={() => setSidebarOpen(false)}>❤️ Wishlist</Link>
              <Link to="/cart" onClick={() => setSidebarOpen(false)}>
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link to="/orders" onClick={() => setSidebarOpen(false)}>📦 My Orders</Link>
              <Link to="/profile" onClick={() => setSidebarOpen(false)}>👤 Profile</Link>
              {user.role === 'admin' && (
                <>
                  <div className="sidebar-divider"></div>
                  <div className="sidebar-section-title">Admin Controls</div>
                  <Link to="/admin" onClick={() => setSidebarOpen(false)}>⚙️ Admin Dashboard</Link>
                  <Link to="/admin/products" onClick={() => setSidebarOpen(false)}>📦 Manage Products</Link>
                  <Link to="/admin/orders" onClick={() => setSidebarOpen(false)}>📋 Manage Orders</Link>
                  <Link to="/admin/users" onClick={() => setSidebarOpen(false)}>👥 Manage Users</Link>
                  <Link to="/admin/coupons" onClick={() => setSidebarOpen(false)}>🏷️ Manage Coupons</Link>
                </>
              )}
              <div className="sidebar-divider"></div>
              <button onClick={handleLogout} className="btn btn-secondary">🚪 Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" onClick={() => setSidebarOpen(false)}>🔐 Login</Link>
              <Link to="/register" onClick={() => setSidebarOpen(false)}>📝 Register</Link>
            </>
          )}
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;
