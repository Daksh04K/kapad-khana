import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {!imageLoaded && <div className="image-skeleton"></div>}
        <img 
          src={product.images[0]} 
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="stock-badge">Only {product.stock} left</span>
        )}
        <div className="product-overlay">
          <button className="quick-view-btn" title="Quick View">
            <FiEye />
          </button>
        </div>
        <button className="wishlist-btn" onClick={handleWishlist}>
          {isInWishlist(product._id) ? (
            <FaHeart color="#d4af37" />
          ) : (
            <FiHeart />
          )}
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-brand">{product.seller}</p>
        <div className="product-price-section">
          <span className="product-price">₹{product.price}</span>
          {product.originalPrice > 0 && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        <div className="product-footer">
          <div className="product-rating">
            ⭐ {product.rating.toFixed(1)}
            <span className="review-count">({product.numReviews})</span>
          </div>
          {product.stock === 0 && (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
