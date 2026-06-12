const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/goalzone');
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    
    await users.updateOne(
      { email: 'admin@goalzone.com' },
      { $set: { 
          name: 'Super Admin', 
          email: 'admin@goalzone.com', 
          password: password, 
          role: 'superadmin', 
          createdAt: new Date(), 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    console.log('Admin user created successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
