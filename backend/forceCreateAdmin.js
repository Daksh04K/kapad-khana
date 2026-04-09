import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    
    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@kapadkhana.com' });
    console.log('Deleted old admin if existed');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin directly
    const admin = new User({
      name: 'Admin',
      email: 'admin@kapadkhana.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@kapadkhana.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\nYou can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
