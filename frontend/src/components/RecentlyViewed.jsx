import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './RecentlyViewed.css';

const RecentlyViewed = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [currentProductId]);

  const fetchRecentlyViewed = async () => {
    try {
      // Get recently viewed product IDs from localStorage
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Filter out current product
      const filteredIds = recentIds.filter(id => id !== currentProductId);
      
      if (filteredIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch product details for recently viewed IDs
      const productPromises = filteredIds.slice(0, 10).map(id =>
        axios.get(`/api/products/${id}`).catch(() => null)
      );
      
      const responses = await Promise.all(productPromises);
      const products = responses
        .filter(res => res && res.data)
        .map(res => res.data);
      
      setRecentProducts(products);
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('recently-viewed-scroll');
    const scrollAmount = 200;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
      setScrollPosition(container.scrollLeft - scrollAmount);
    } else {
      container.scrollLeft += scrollAmount;
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  if (loading || recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="recently-viewed-section">
      <div className="container">
        <div className="section-header">
          <h2>Recently Viewed</h2>
          <p>Products you've checked out</p>
        </div>

        <div className="recently-viewed-wrapper">
          <button 
            className="scroll-btn left" 
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <FiChevronLeft />
          </button>

          <div className="recently-viewed-scroll" id="recently-viewed-scroll">
            {recentProducts.map(product => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`} 
                className="recent-product-card"
              >
                <div className="recent-product-image">
                  <img src={product.images[0]} alt={product.name} />
                  {product.discount > 0 && (
                    <span className="discount-badge">{product.discount}% OFF</span>
                  )}
                </div>
                <div className="recent-product-info">
                  <h4>{product.name}</h4>
                  <div className="recent-product-price">
                    <span className="price">₹{product.price}</span>
                    {product.originalPrice > 0 && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="recent-product-rating">
                    ⭐ {product.rating.toFixed(1)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button 
            className="scroll-btn right" 
            onClick={() => scroll('right')}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
