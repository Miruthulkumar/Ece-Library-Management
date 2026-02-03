const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

console.log('📧 Updating demo email addresses to @mkce.ac.in...\n');

async function updateEmails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas\n');

    // Email mapping - change @ece.edu to @mkce.ac.in
    const emailUpdates = [
      { old: 'admin@ece.edu', new: 'admin@mkce.ac.in' },
      { old: 'student@ece.edu', new: 'student@mkce.ac.in' },
      { old: 'faculty@ece.edu', new: 'faculty@mkce.ac.in' },
    ];

    for (const update of emailUpdates) {
      const result = await User.updateOne(
        { email: update.old },
        { $set: { email: update.new } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${update.old} → ${update.new}`);
      } else {
        console.log(`ℹ️  User not found: ${update.old}`);
      }
    }

    console.log('\n✨ Email addresses updated successfully!');
    console.log('\n📝 Updated credentials:');
    console.log('   Librarian: admin@mkce.ac.in / admin123');
    console.log('   Student: student@mkce.ac.in / student123');
    console.log('   Faculty: faculty@mkce.ac.in / faculty123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

updateEmails();
