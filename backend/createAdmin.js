import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB'.cyan.underline);
    
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      
      // Check if admin already exists
      const adminExists = await User.findOne({ email: adminEmail });
      
      if (adminExists) {
        console.log('Admin user already exists'.yellow);
        console.log(`Email: ${adminEmail}`);
        console.log('Login using email verification code');
      } else {
        // Create admin user with a random password (will use email verification for login)
        const randomPassword = Math.random().toString(36).slice(-8);
        
        const admin = await User.create({
          username: 'admin',
          email: adminEmail,
          password: randomPassword,
          isAdmin: true
        });
        
        if (admin) {
          console.log('Admin user created successfully'.green);
          console.log(`Email: ${adminEmail}`);
          console.log('Login using email verification code');
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`.red);
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    process.exit();
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`.red.underline.bold);
    process.exit(1);
  }); 