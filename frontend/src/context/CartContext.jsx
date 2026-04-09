import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const { data } = await axios.post(
        '/api/cart',
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCart(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(
        `/api/cart/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCart(data);
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCart(data);
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCart({ items: [] });
    } catch (error) {
      throw error;
    }
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateCartItem, removeFromCart, clearCart, cartCount, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
