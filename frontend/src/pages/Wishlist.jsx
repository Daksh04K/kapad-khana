import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { FiArrowLeft } from 'react-icons/fi';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  if (wishlist.products.length === 0) {
    return (
      <>
      <Breadcrumb />
      <div className="empty-wishlist">
        <h2>Your wishlist is empty</h2>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
      </>
    );
  }

  return (
    <div className="wishlist-page">
      <Breadcrumb />
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>My Wishlist</h1>
        <div className="products-grid">
          {wishlist.products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
