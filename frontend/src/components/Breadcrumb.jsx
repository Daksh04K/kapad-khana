import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import './Breadcrumb.css';

const Breadcrumb = ({ productName, category }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path, index) => {
    // Custom names for specific routes
    if (path === 'products' && index === 0) return 'Products';
    if (path === 'cart') return 'Shopping Cart';
    if (path === 'wishlist') return 'Wishlist';
    if (path === 'checkout') return 'Checkout';
    if (path === 'orders') return 'My Orders';
    if (path === 'profile') return 'My Profile';
    if (path === 'order-success') return 'Order Success';
    
    // For product details page
    if (productName && index === pathnames.length - 1) {
      return productName;
    }
    
    // Capitalize first letter
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="breadcrumb">
      <div className="container">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link to="/">
              <FiHome />
              <span>Home</span>
            </Link>
          </li>
          
          {pathnames.map((path, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const name = getBreadcrumbName(path, index);

            return (
              <li key={routeTo} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                <FiChevronRight className="breadcrumb-separator" />
                {isLast ? (
                  <span>{name}</span>
                ) : (
                  <Link to={routeTo}>{name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
