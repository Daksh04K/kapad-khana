import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    if (category) {
      // Case-insensitive category matching
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    let products = Product.find(query);

    if (sort === 'price-low') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-high') {
      products = products.sort({ price: -1 });
    } else if (sort === 'rating') {
      products = products.sort({ rating: -1 });
    }

    const result = await products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
