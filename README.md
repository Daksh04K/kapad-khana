# 🛍️ Kapad Khana - Premium E-Commerce Platform

A modern, full-stack e-commerce web application specialized in clothing, built with the MERN stack.

**Perfect for University Major/Minor Projects!**

---

## 🎯 NEW USER? START HERE!

### 👉 **[START_HERE.md](START_HERE.md)** ⭐
**Read this first!** It will guide you to the right documentation based on your needs.

---

## 📚 All Documentation

| Guide | Purpose | Time | For |
|-------|---------|------|-----|
| **[START_HERE.md](START_HERE.md)** | Choose your path | 2 min | Everyone |
| **[QUICK_START.md](QUICK_START.md)** | Fast setup | 5 min | Experienced devs |
| **[BEGINNER_SETUP_GUIDE.md](BEGINNER_SETUP_GUIDE.md)** | Detailed guide | 30 min | Beginners |
| **[UNIVERSITY_PROJECT_NOTES.md](UNIVERSITY_PROJECT_NOTES.md)** | Academic help | 20 min | Students |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Overview | 10 min | Quick reference |
| **[INSTALLATION_STEPS.txt](INSTALLATION_STEPS.txt)** | Visual guide | 20 min | Visual learners |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | Find docs | 5 min | Navigation |

---

## ✨ Features

### 👤 User Features
- User authentication (Register/Login with JWT)
- Browse products with search and filters
- Product details with multiple images
- Size selection and quantity management
- Shopping cart with persistent storage
- Wishlist functionality
- Secure checkout with multiple payment options
- Order tracking and history
- User profile management

### 👨‍💼 Admin Features
- Admin dashboard
- Product management (Add/Edit/Delete)
- Order management with status updates
- User management
- Image upload to Cloudinary

### 🔧 Technical Features
- Responsive mobile-first design
- Modern UI with custom CSS
- JWT authentication
- Protected routes
- Role-based access control
- MongoDB database with Mongoose
- RESTful API
- Payment integration (Razorpay/Stripe)
- Toast notifications
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios
- Context API for state management
- React Toastify
- React Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Razorpay for payments

## 🎓 University Project Mode

**Important:** This project includes a **DEMO PAYMENT SYSTEM** perfect for university projects!

- ✅ No real payment gateway needed
- ✅ Simulates complete payment flow
- ✅ Perfect for demonstrations
- ✅ No financial credentials required

---

## 🚀 Quick Installation

### Prerequisites
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB Atlas account (FREE) - [Sign Up](https://www.mongodb.com/cloud/atlas/register)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_from_atlas
JWT_SECRET=kapadkhana_secret_key_2024
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Note:** Only MongoDB URI is required. Others have default values for demo.

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 👨‍💼 Create Admin Account

After registering a user:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Browse Collections → `users`
3. Find your user
4. Edit: Change `role` from `"user"` to `"admin"`
5. Save and refresh the website

Now you can access Admin Panel!

---

## 🎯 Sample Products

Use these free image URLs when adding products:

- **T-Shirt:** `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500`
- **Jeans:** `https://images.unsplash.com/photo-1542272604-787c3835535d?w=500`
- **Jacket:** `https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500`
- **Dress:** `https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500`
- **Shoes:** `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500`

---

## 🎨 Features Demo

### User Flow:
1. Register/Login
2. Browse Products
3. Add to Cart & Wishlist
4. Checkout
5. Choose Payment (COD or Online Demo)
6. Track Orders

### Admin Flow:
1. Login as Admin
2. Add/Edit/Delete Products
3. Manage Orders
4. Update Order Status
5. View Users

---

## 💳 Payment System (Demo Mode)

The payment system is in **DEMO MODE** for university projects:

- **Cash on Delivery (COD):** Works immediately
- **Online Payment:** Simulated payment (no real gateway needed)
  - Shows "Processing payment... (Demo Mode)"
  - Automatically approves after 2 seconds
  - Perfect for demonstrations

---

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

---

## 🎓 For University Students

This project is perfect for:
- Major Project
- Minor Project
- Final Year Project
- Web Development Course Project

**See [UNIVERSITY_PROJECT_NOTES.md](UNIVERSITY_PROJECT_NOTES.md) for:**
- Project report structure
- Presentation tips
- Testing scenarios
- Common questions & answers

---

## 📸 Screenshots

Take screenshots of:
- Homepage
- Product listing
- Product details
- Shopping cart
- Checkout page
- Order success
- Admin dashboard
- Mobile views

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check internet connection
- Verify connection string in `.env`
- Whitelist your IP in MongoDB Atlas

### Port Already in Use
- Change PORT in `.env` to 5001
- Or stop other applications using port 5000

### Cannot Find Module
- Delete `node_modules` folder
- Run `npm install` again

**More help:** See [BEGINNER_SETUP_GUIDE.md](BEGINNER_SETUP_GUIDE.md)

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to environment variables

## 📊 Project Statistics

- **Total Files:** 50+
- **Lines of Code:** 3000+
- **Components:** 15+
- **API Endpoints:** 25+
- **Database Models:** 5

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- GET `/api/products/search` - Search products

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add to cart
- PUT `/api/cart/:itemId` - Update cart item
- DELETE `/api/cart/:itemId` - Remove from cart

### Wishlist
- GET `/api/wishlist` - Get wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/:productId` - Remove from wishlist

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/myorders` - Get user orders
- GET `/api/orders/:id` - Get order by ID

### Admin
- POST `/api/admin/products` - Create product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product
- GET `/api/admin/orders` - Get all orders
- PUT `/api/admin/orders/:id` - Update order status
- GET `/api/admin/users` - Get all users

## 🎨 Color Theme

- **Primary:** #020617 (Dark Navy)
- **Secondary:** #1e293b (Grey Blue)
- **Accent:** #f97316 (Orange)
- **Background:** #f1f5f9
- **Card Background:** #ffffff

---

## 📞 Support

Need help? Check these guides:
1. [Quick Start](QUICK_START.md) - 5 minute setup
2. [Beginner Guide](BEGINNER_SETUP_GUIDE.md) - Detailed instructions
3. [University Notes](UNIVERSITY_PROJECT_NOTES.md) - Academic help

---

## ⭐ Features Checklist

- ✅ User Authentication (JWT)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Order Processing
- ✅ Payment System (Demo)
- ✅ Admin Dashboard
- ✅ Responsive Design
- ✅ Search Functionality
- ✅ Order Tracking

---

## 🎉 Success!

You now have a fully functional e-commerce platform perfect for:
- Learning full-stack development
- University project submission
- Portfolio showcase
- Understanding MERN stack

**Good luck with your project! 🚀**

---

## 📄 License

MIT License - Free to use for educational purposes

## 👨‍💻 Author

Kapad Khana Development Team

---

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!
