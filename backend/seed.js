import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kapadkhana';

// ── Inline schemas (avoid import issues) ─────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: { type: String, default: 'user' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String, description: String, price: Number, originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, seller: String, images: [String], sizes: [String],
  stock: Number, rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  category: String
}, { timestamps: true });

const couponSchema = new mongoose.Schema({
  code: String, type: String, value: Number, minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null }, usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 }, expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User    = mongoose.model('User',    userSchema);
const Product = mongoose.model('Product', productSchema);
const Coupon  = mongoose.model('Coupon',  couponSchema);

// ── Sample Data ───────────────────────────────────────────────────────────────
const products = [
  // MEN
  {
    name: 'Classic White Oxford Shirt',
    description: 'Premium cotton Oxford shirt perfect for formal and casual occasions. Features a button-down collar and chest pocket.',
    price: 899, originalPrice: 1499, discount: 40,
    seller: 'Arrow', category: 'men',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
             'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], stock: 45, rating: 4.3, numReviews: 128
  },
  {
    name: 'Slim Fit Chino Pants',
    description: 'Modern slim fit chinos made from stretch cotton blend. Versatile for office and casual wear.',
    price: 1299, originalPrice: 1999, discount: 35,
    seller: 'Levi\'s', category: 'men',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80',
             'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80'],
    sizes: ['S','M','L','XL'], stock: 30, rating: 4.5, numReviews: 89
  },
  {
    name: 'Graphic Print T-Shirt',
    description: 'Trendy graphic tee made from 100% combed cotton. Relaxed fit for everyday comfort.',
    price: 499, originalPrice: 799, discount: 38,
    seller: 'H&M', category: 'men',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], stock: 60, rating: 4.1, numReviews: 203
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern fit. Features button closure and multiple pockets.',
    price: 1899, originalPrice: 2999, discount: 37,
    seller: 'Wrangler', category: 'men',
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&q=80'],
    sizes: ['S','M','L','XL'], stock: 20, rating: 4.6, numReviews: 67
  },
  // WOMEN
  {
    name: 'Floral Wrap Dress',
    description: 'Elegant floral wrap dress in lightweight chiffon. Perfect for summer outings and parties.',
    price: 1199, originalPrice: 1899, discount: 37,
    seller: 'Zara', category: 'women',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
             'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80'],
    sizes: ['XS','S','M','L','XL'], stock: 35, rating: 4.7, numReviews: 156
  },
  {
    name: 'High Waist Skinny Jeans',
    description: 'Flattering high-waist skinny jeans with stretch denim for all-day comfort.',
    price: 1499, originalPrice: 2299, discount: 35,
    seller: 'Levi\'s', category: 'women',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80'],
    sizes: ['XS','S','M','L'], stock: 40, rating: 4.4, numReviews: 112
  },
  {
    name: 'Embroidered Kurti',
    description: 'Beautiful hand-embroidered kurti in pure cotton. Traditional design with modern silhouette.',
    price: 799, originalPrice: 1299, discount: 38,
    seller: 'Biba', category: 'women',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], stock: 50, rating: 4.5, numReviews: 94
  },
  {
    name: 'Crop Top & Palazzo Set',
    description: 'Trendy crop top paired with wide-leg palazzo pants. Comfortable and stylish for casual outings.',
    price: 999, originalPrice: 1599, discount: 38,
    seller: 'Myntra Fashion', category: 'women',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4f7f?w=500&q=80'],
    sizes: ['XS','S','M','L'], stock: 25, rating: 4.2, numReviews: 78
  },
  // KIDS
  {
    name: 'Kids Cartoon T-Shirt',
    description: 'Fun and colorful cartoon print t-shirt for kids. Made from soft cotton for all-day comfort.',
    price: 349, originalPrice: 599, discount: 42,
    seller: 'H&M Kids', category: 'kids',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80'],
    sizes: ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y'], stock: 80, rating: 4.6, numReviews: 234
  },
  {
    name: 'Kids Denim Dungaree',
    description: 'Adorable denim dungaree for kids. Durable and easy to wear with adjustable straps.',
    price: 699, originalPrice: 1099, discount: 36,
    seller: 'Zara Kids', category: 'kids',
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80'],
    sizes: ['2-3Y','4-5Y','6-7Y','8-9Y'], stock: 45, rating: 4.4, numReviews: 89
  },
  // ETHNIC WEAR
  {
    name: 'Men\'s Kurta Pajama Set',
    description: 'Traditional kurta pajama set in premium cotton. Perfect for festivals and family occasions.',
    price: 1299, originalPrice: 1999, discount: 35,
    seller: 'Manyavar', category: 'ethnic',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], stock: 30, rating: 4.7, numReviews: 145
  },
  {
    name: 'Banarasi Silk Saree',
    description: 'Exquisite Banarasi silk saree with intricate zari work. A timeless piece for special occasions.',
    price: 3999, originalPrice: 5999, discount: 33,
    seller: 'Nalli Silks', category: 'ethnic',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'],
    sizes: ['Free Size'], stock: 15, rating: 4.9, numReviews: 67
  },
  // ACCESSORIES
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with multiple card slots and a coin pocket.',
    price: 599, originalPrice: 999, discount: 40,
    seller: 'Hidesign', category: 'accessories',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80'],
    sizes: ['Free Size'], stock: 100, rating: 4.3, numReviews: 312
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses with UV400 protection. Lightweight metal frame.',
    price: 799, originalPrice: 1299, discount: 38,
    seller: 'Ray-Ban', category: 'accessories',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80'],
    sizes: ['Free Size'], stock: 60, rating: 4.5, numReviews: 189
  },
  // FOOTWEAR
  {
    name: 'White Sneakers',
    description: 'Clean white sneakers with cushioned sole. Versatile for casual and semi-formal wear.',
    price: 1999, originalPrice: 2999, discount: 33,
    seller: 'Nike', category: 'footwear',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
             'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80'],
    sizes: ['6','7','8','9','10','11'], stock: 40, rating: 4.6, numReviews: 278
  },
  {
    name: 'Kolhapuri Chappals',
    description: 'Handcrafted genuine leather Kolhapuri chappals. Traditional design with modern comfort.',
    price: 899, originalPrice: 1399, discount: 36,
    seller: 'Kolhapuri Craft', category: 'footwear',
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80'],
    sizes: ['6','7','8','9','10'], stock: 35, rating: 4.4, numReviews: 92
  },
  // WESTERN WEAR
  {
    name: 'Blazer - Navy Blue',
    description: 'Sharp navy blue blazer in premium wool blend. Perfect for business meetings and formal events.',
    price: 2999, originalPrice: 4999, discount: 40,
    seller: 'Raymond', category: 'western',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80'],
    sizes: ['S','M','L','XL'], stock: 18, rating: 4.7, numReviews: 56
  },
  {
    name: 'Hoodie - Oversized',
    description: 'Cozy oversized hoodie in fleece fabric. Perfect for winters and casual outings.',
    price: 1199, originalPrice: 1799, discount: 33,
    seller: 'Puma', category: 'western',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], stock: 55, rating: 4.5, numReviews: 167
  },
  // Low stock items (for analytics demo)
  {
    name: 'Limited Edition Silk Tie',
    description: 'Premium silk tie with hand-stitched details. Limited edition design.',
    price: 1499, originalPrice: 2499, discount: 40,
    seller: 'Louis Philippe', category: 'accessories',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80'],
    sizes: ['Free Size'], stock: 3, rating: 4.8, numReviews: 23
  },
  {
    name: 'Handloom Cotton Saree',
    description: 'Pure handloom cotton saree with traditional border. Comfortable for daily wear.',
    price: 1299, originalPrice: 1999, discount: 35,
    seller: 'Fabindia', category: 'ethnic',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'],
    sizes: ['Free Size'], stock: 2, rating: 4.6, numReviews: 41
  }
];

const coupons = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 0,    maxDiscount: 200,  usageLimit: null, isActive: true },
  { code: 'SAVE20',    type: 'percentage', value: 20, minOrderAmount: 999,  maxDiscount: 500,  usageLimit: 100,  isActive: true },
  { code: 'FLAT100',   type: 'flat',       value: 100, minOrderAmount: 599, maxDiscount: null, usageLimit: 50,   isActive: true },
  { code: 'FLAT200',   type: 'flat',       value: 200, minOrderAmount: 1499, maxDiscount: null, usageLimit: 30,  isActive: true },
  { code: 'ETHNIC50',  type: 'percentage', value: 50, minOrderAmount: 1999, maxDiscount: 1000, usageLimit: 20,   isActive: true },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@kapadkhana.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('👤 Admin created: admin@kapadkhana.com / admin123');

    // Create sample user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@kapadkhana.com',
      password: userPassword,
      role: 'user'
    });
    console.log('👤 Demo user created: user@kapadkhana.com / user123');

    // Insert products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products inserted`);

    // Insert coupons
    await Coupon.insertMany(coupons);
    console.log(`🏷️  ${coupons.length} coupons inserted`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:    admin@kapadkhana.com / admin123');
    console.log('User Login:     user@kapadkhana.com  / user123');
    console.log('Coupon Codes:   WELCOME10, SAVE20, FLAT100, FLAT200, ETHNIC50');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
