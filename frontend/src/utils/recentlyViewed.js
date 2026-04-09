// Utility functions for managing recently viewed products

const MAX_RECENT_PRODUCTS = 20;

/**
 * Add a product to recently viewed list
 * @param {string} productId - The product ID to add
 */
export const addToRecentlyViewed = (productId) => {
  try {
    // Get existing recently viewed products
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove product if it already exists (to move it to front)
    const filtered = recentlyViewed.filter(id => id !== productId);
    
    // Add product to the beginning
    filtered.unshift(productId);
    
    // Keep only the last MAX_RECENT_PRODUCTS items
    const limited = filtered.slice(0, MAX_RECENT_PRODUCTS);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

/**
 * Get all recently viewed product IDs
 * @returns {Array} Array of product IDs
 */
export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem('recentlyViewed');
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

/**
 * Remove a specific product from recently viewed
 * @param {string} productId - The product ID to remove
 */
export const removeFromRecentlyViewed = (productId) => {
  try {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recentlyViewed.filter(id => id !== productId);
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from recently viewed:', error);
  }
};
