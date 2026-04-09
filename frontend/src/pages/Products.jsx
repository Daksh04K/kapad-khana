import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  useEffect(() => {
    applyFilters();
  }, [products, priceRange, selectedSizes, selectedRating, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products';
      const params = [];

      if (category) {
        params.push(`category=${category}`);
      }
      if (search) {
        url = `/api/products/search?q=${search}`;
      } else if (params.length > 0) {
        url = `/api/products?${params.join('&')}`;
      }

      const { data } = await axios.get(url);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedRating(0);
    setInStockOnly(false);
    setSortBy('');
  };

  const getCategoryTitle = () => {
    if (search) return `Search Results for "${search}"`;
    if (category) {
      const categoryMap = {
        'men': "Men's Fashion",
        'women': "Women's Fashion",
        'kids': "Kids Fashion",
        'accessories': 'Accessories',
        'footwear': 'Footwear',
        'ethnic': 'Ethnic Wear',
        'western': 'Western Wear'
      };
      return categoryMap[category.toLowerCase()] || 'All Products';
    }
    return 'All Products';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Breadcrumb />
      <div className="container">
        <div className="products-header">
          <div className="header-left">
            <h1>{getCategoryTitle()}</h1>
            <span className="product-count">{filteredProducts.length} Products</span>
          </div>
          <div className="header-right">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter /> Filters
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  placeholder="Max"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="price-slider"
              />
              <div className="price-labels">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-filters">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`size-filter-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <h4>Customer Rating</h4>
              <div className="rating-filters">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="rating-filter">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                    />
                    <span>{'⭐'.repeat(rating)} & above</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="filter-section">
              <h4>Availability</h4>
              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-main">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)} />
      )}
    </div>
  );
};

export default Products;
