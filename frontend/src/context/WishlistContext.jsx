import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        '/api/wishlist',
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setWishlist(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setWishlist(data);
    } catch (error) {
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
