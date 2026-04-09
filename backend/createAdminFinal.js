import mongoose from 'mongoose';
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

    // Create admin - let the pre-save hook hash the password
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@kapadkhana.com',
      password: 'admin123', // Plain password - will be hashed by pre-save hook
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@kapadkhana.com');
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('\nYou can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
