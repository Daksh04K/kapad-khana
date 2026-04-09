import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { FiTruck, FiShield, FiRefreshCw, FiAward, FiChevronRight } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      title: "Premium Fashion Sale",
      subtitle: "Up to 70% OFF on Top Brands",
      bg: "linear-gradient(135deg, #000000 0%, #2d2d2d 100%)",
      cta: "Shop Now"
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Trends in Fashion",
      bg: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
      cta: "Explore Collection"
    },
    {
      title: "Exclusive Collection",
      subtitle: "Luxury Clothing & Accessories",
      bg: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
      cta: "Discover More"
    }
  ];

  const deals = [    
    { category: "Men's Fashion", discount: "50-80%", icon: "👔", link: "/products?category=men" },
    { category: "Women's Fashion", discount: "40-70%", icon: "👗", link: "/products?category=women" },
    { category: "Kids Wear", discount: "30-60%", icon: "👶", link: "/products?category=kids" },
    { category: "Footwear", discount: "40-80%", icon: "👟", link: "/products?category=footwear" },
    { category: "Accessories", discount: "30-70%", icon: "👜", link: "/products?category=accessories" },
    { category: "Ethnic Wear", discount: "50-70%", icon: "🥻", link: "/products?category=ethnic" }
  ];

  const features = [
    { icon: <FiTruck />, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: <FiShield />, title: "Secure Payment", desc: "100% secure transactions" },
    { icon: <FiRefreshCw />, title: "Easy Returns", desc: "7 days return policy" },
    { icon: <FiAward />, title: "Premium Quality", desc: "Authentic products only" }
  ];

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products?sort=rating');
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="banner-carousel">
        <div className="banner animate-fade" style={{ background: banners[currentBanner].bg }}>
          <div className="banner-content">
            <h1 className="animate-slide-up">{banners[currentBanner].title}</h1>
            <p className="animate-slide-up delay-1">{banners[currentBanner].subtitle}</p>
            <Link to="/products" className="btn btn-primary animate-slide-up delay-2">
              {banners[currentBanner].cta} <FiChevronRight />
            </Link>
          </div>
          <div className="banner-overlay"></div>
        </div>
        <div className="banner-dots">
          {banners.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="deals-section">
        <div className="container">
          <div className="section-header">
            <h2>Top Deals on Fashion</h2>
            <p>Grab the best offers before they're gone!</p>
          </div>
          <div className="deals-grid">
            {deals.map((deal, index) => (
              <Link to={deal.link} key={index} className="deal-card">
                <div className="deal-icon">{deal.icon}</div>
                <h3>{deal.category}</h3>
                <p className="deal-discount">{deal.discount} OFF</p>
                <span className="deal-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Best of Fashion</h2>
            <p>Handpicked collection just for you</p>
          </div>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/products" className="btn btn-outline">
              View All Products <FiChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to get special offers, free giveaways, and exclusive deals</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
