import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './RelatedProducts.css';

const RelatedProducts = ({ currentProductId, category, priceRange }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, category]);

  const fetchRelatedProducts = async () => {
    try {
      // Fetch products from the same category
      const { data } = await axios.get(`/api/products?category=${category}`);
      
      // Filter out current product and get similar price range
      const filtered = data
        .filter(product => product._id !== currentProductId)
        .filter(product => {
          if (!priceRange) return true;
          const priceDiff = Math.abs(product.price - priceRange);
          return priceDiff <= priceRange * 0.5; // Within 50% price range
        })
        .slice(0, 10); // Limit to 10 products
      
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('related-products-scroll');
    const scrollAmount = 250;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
      setScrollPosition(container.scrollLeft - scrollAmount);
    } else {
      container.scrollLeft += scrollAmount;
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products-section">
      <div className="container">
        <div className="section-header">
          <h2>You May Also Like</h2>
          <p>Similar products in this category</p>
        </div>

        <div className="related-products-wrapper">
          <button 
            className="scroll-btn left" 
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <FiChevronLeft />
          </button>

          <div className="related-products-scroll" id="related-products-scroll">
            {relatedProducts.map(product => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`} 
                className="related-product-card"
              >
                <div className="related-product-image">
                  <img src={product.images[0]} alt={product.name} />
                  {product.discount > 0 && (
                    <span className="discount-badge">{product.discount}% OFF</span>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="stock-badge">Only {product.stock} left</span>
                  )}
                </div>
                <div className="related-product-info">
                  <h4>{product.name}</h4>
                  <p className="brand">{product.seller}</p>
                  <div className="related-product-price">
                    <span className="price">₹{product.price}</span>
                    {product.originalPrice > 0 && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="related-product-rating">
                    ⭐ {product.rating.toFixed(1)} ({product.numReviews})
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

export default RelatedProducts;
