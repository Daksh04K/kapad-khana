import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiX, FiZoomIn, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { addToRecentlyViewed } from '../utils/recentlyViewed';
import RecentlyViewed from '../components/RecentlyViewed';
import RelatedProducts from '../components/RelatedProducts';
import Breadcrumb from '../components/Breadcrumb';
import ReviewSection from '../components/ReviewSection';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      if (data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      
      // Add to recently viewed
      addToRecentlyViewed(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await addToCart(product._id, selectedSize, quantity);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Kapad Khana`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <Breadcrumb productName={product.name} category={product.category} />
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="product-details">
          <div className="product-images">
            <div className="main-image" onClick={() => setShowImageModal(true)}>
              <img src={product.images[selectedImage]} alt={product.name} />
              <div className="image-overlay">
                <FiZoomIn className="zoom-icon" />
                <span>Click to zoom</span>
              </div>
              {product.images.length > 1 && (
                <>
                  <button className="image-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                    <FiChevronLeft />
                  </button>
                  <button className="image-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                    <FiChevronRight />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info-detail">
            <div className="product-header">
              <div>
                <h1>{product.name}</h1>
                <p className="seller">by {product.seller}</p>
              </div>
              <button className="share-btn" onClick={handleShare} title="Share product">
                <FiShare2 />
              </button>
            </div>
            <div className="rating">⭐ {product.rating.toFixed(1)} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</div>
            <div className="price-section">
              <div className="price">₹{product.price}</div>
              {product.stock < 10 && product.stock > 0 && (
                <span className="stock-warning">Only {product.stock} left!</span>
              )}
            </div>

            <div className="size-selector">
              <label>Select Size:</label>
              <div className="sizes">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-outline" onClick={handleWishlist}>
                {isInWishlist(product._id) ? <FaHeart color="#f97316" /> : <FiHeart />}
                {isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Free Delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">↻</span>
                <span>7 Days Return</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Fast Shipping</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <button className="modal-close" onClick={() => setShowImageModal(false)}>
            <FiX />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className={imageZoom ? 'zoomed' : ''}
              onClick={() => setImageZoom(!imageZoom)}
            />
            {product.images.length > 1 && (
              <>
                <button className="modal-nav prev" onClick={prevImage}>
                  <FiChevronLeft />
                </button>
                <button className="modal-nav next" onClick={nextImage}>
                  <FiChevronRight />
                </button>
                <div className="modal-thumbnails">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts currentProductId={id} category={product.category} priceRange={product.price} />

      {/* Reviews */}
      <ReviewSection productId={id} />

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={id} />
    </div>
  );
};

export default ProductDetails;
