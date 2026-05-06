import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Content from './models/Content.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Create default content
    const sections = ['hero', 'header', 'footer', 'about'];
    
    for (const section of sections) {
      const exists = await Content.findOne({ section });
      if (!exists) {
        await Content.create({
          section,
          title: `${section.charAt(0).toUpperCase() + section.slice(1)} Title`,
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} description`,
          additionalData: {}
        });
        console.log(`${section} content created`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
