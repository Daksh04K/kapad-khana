import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-column">
              <h3>About Kapad Khana</h3>
              <p className="footer-desc">
                Your one-stop destination for premium fashion. We bring you the latest trends in clothing, footwear, and accessories at unbeatable prices.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FiTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <FiYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?category=men">Men's Fashion</Link></li>
                <li><Link to="/products?category=women">Women's Fashion</Link></li>
                <li><Link to="/products?category=kids">Kids Wear</Link></li>
                <li><Link to="/products?category=accessories">Accessories</Link></li>
                <li><Link to="/products?category=footwear">Footwear</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/orders">Track Order</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#returns">Returns & Exchange</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h3>Contact Us</h3>
              <ul className="footer-contact">
                <li>
                  <FiMapPin />
                  <span>P.P.Savani University, NH-8, Kosamba, Gujarat - 394125</span>
                </li>
                <li>
                  <FiPhone />
                  <span>+91 95120 35619</span>
                </li>
                <li>
                  <FiMail />
                  <span>ppsu@kapadkhana.com</span>
                </li>
              </ul>
              <div className="business-hours">
                <h4>Business Hours</h4>
                <p>Mon - Sat: 9:00 AM - 9:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 Kapad Khana. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="#terms">Terms & Conditions</a>
              <span className="separator">|</span>
              <a href="#sitemap">Sitemap</a>
            </div>
          </div>
          <div className="payment-methods">
            <span>We Accept:</span>
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💰</span>
              <span className="payment-icon">📱</span>
              <span className="payment-icon">🏦</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
