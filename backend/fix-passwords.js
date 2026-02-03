const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

console.log('🔧 Fixing user passwords in MongoDB Atlas...\n');

async function fixPasswords() {
  try {
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    // Default passwords for migrated users
    const defaultPasswords = {
      'admin@ece.edu': 'admin123',
      'student@ece.edu': 'student123',
      'faculty@ece.edu': 'faculty123',
    };

    for (const user of users) {
      // Check if password exists and is already hashed
      if (!user.password || user.password === 'undefined' || user.password.length < 10) {
        // Assign default password or a generic one
        const defaultPassword = defaultPasswords[user.email] || 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        
        // Update user directly in collection to bypass validation
        await User.collection.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`✅ Fixed password for: ${user.email} (${user.name})`);
      } else {
        console.log(`ℹ️  Password already set for: ${user.email}`);
      }
    }

    console.log('\n✨ All passwords fixed!');
    console.log('\n📝 Default credentials:');
    console.log('   admin@ece.edu / admin123');
    console.log('   student@ece.edu / student123');
    console.log('   faculty@ece.edu / faculty123');
    console.log('   Other users: password123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

fixPasswords();
