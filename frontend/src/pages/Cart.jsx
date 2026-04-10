import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try { await updateCartItem(itemId, newQuantity); }
    catch (error) { toast.error("Failed to update quantity"); }
  };

  const handleRemove = async (itemId) => {
    try { await removeFromCart(itemId); toast.success("Item removed"); }
    catch (error) { toast.error("Failed to remove item"); }
  };

  const safeItems = (cart && Array.isArray(cart.items)) ? cart.items.filter(i => i && i.product) : [];
  const total = safeItems.reduce((t, i) => t + ((i.product.price || 0) * i.quantity), 0);

  if (!cart) return <div className="loading"><div className="spinner"></div></div>;

  if (safeItems.length === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </>
    );
  }

  return (
    <div className="cart-page">
      <Breadcrumb />
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {safeItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.product.images[0]} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-seller">{item.product.seller}</p>
                  <p className="item-size">Size: {item.size}</p>
                  <p className="item-price">Rs.{item.product.price}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}><FiMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}><FiPlus /></button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item._id)}><FiTrash2 /> Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({safeItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span>Rs.{total}</span>
            </div>
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-total"><span>Total</span><span>Rs.{total}</span></div>
            <button className="btn btn-primary" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;