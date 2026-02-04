const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const User = require('../models/user');

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create the sparse unique index for phoneNumber
    await User.collection.createIndex(
      { phoneNumber: 1 },
      { 
        unique: true, 
        sparse: true,
        partialFilterExpression: { phoneNumber: { $ne: "" } }
      }
    );

    console.log('✓ Phone number index created successfully');
    console.log('✓ Duplicate phone numbers will now be prevented');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();
