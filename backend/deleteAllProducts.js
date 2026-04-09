import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const deleteAllProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Count products before deletion
    const count = await Product.countDocuments();
    console.log(`Found ${count} products in database`);

    if (count === 0) {
      console.log('✓ Database is already empty. No products to delete.');
      process.exit(0);
    }

    // Delete all products
    const result = await Product.deleteMany({});
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} products`);
    console.log('✓ All products have been removed from the database.');
    console.log('\nYou can now add products manually through the admin panel.');
    console.log('Go to: Admin Panel → Products → Add Product');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

deleteAllProducts();
