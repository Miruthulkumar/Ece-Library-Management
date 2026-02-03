const mongoose = require('mongoose');
require('dotenv').config();

// Models
const User = require('./models/User');
const Book = require('./models/Book');
const Issue = require('./models/Issue');
const Reservation = require('./models/Reservation');
const Fine = require('./models/Fine');

// Connection URIs
const LOCALHOST_URI = 'mongodb://localhost:27017/ece-library';
const ATLAS_URI = process.env.MONGODB_URI;

console.log('🚀 Starting migration from localhost to MongoDB Atlas...\n');

async function migrateData() {
  try {
    // Step 1: Connect to localhost and export data
    console.log('📥 Connecting to localhost database...');
    await mongoose.connect(LOCALHOST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to localhost\n');

    console.log('📤 Exporting data from localhost...');
    
    const users = await User.find({}).lean();
    const books = await Book.find({}).lean();
    const issues = await Issue.find({}).lean();
    const reservations = await Reservation.find({}).lean();
    const fines = await Fine.find({}).lean();

    console.log(`   Users: ${users.length}`);
    console.log(`   Books: ${books.length}`);
    console.log(`   Issues: ${issues.length}`);
    console.log(`   Reservations: ${reservations.length}`);
    console.log(`   Fines: ${fines.length}`);
    console.log('✅ Data exported successfully\n');

    // Disconnect from localhost
    await mongoose.disconnect();
    console.log('✅ Disconnected from localhost\n');

    // Step 2: Connect to MongoDB Atlas
    console.log('📥 Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas\n');

    // Step 3: Clear existing Atlas data (optional)
    console.log('🗑️  Clearing existing Atlas data...');
    await User.deleteMany({});
    await Book.deleteMany({});
    await Issue.deleteMany({});
    await Reservation.deleteMany({});
    await Fine.deleteMany({});
    console.log('✅ Existing Atlas data cleared\n');

    // Step 4: Import data to Atlas
    console.log('📥 Importing data to MongoDB Atlas...');

    if (users.length > 0) {
      await User.collection.insertMany(users);
      console.log(`   ✅ Users imported: ${users.length}`);
    }

    if (books.length > 0) {
      await Book.collection.insertMany(books);
      console.log(`   ✅ Books imported: ${books.length}`);
    }

    if (issues.length > 0) {
      await Issue.collection.insertMany(issues);
      console.log(`   ✅ Issues imported: ${issues.length}`);
    }

    if (reservations.length > 0) {
      await Reservation.collection.insertMany(reservations);
      console.log(`   ✅ Reservations imported: ${reservations.length}`);
    }

    if (fines.length > 0) {
      await Fine.collection.insertMany(fines);
      console.log(`   ✅ Fines imported: ${fines.length}`);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Books: ${books.length}`);
    console.log(`   Total Issues: ${issues.length}`);
    console.log(`   Total Reservations: ${reservations.length}`);
    console.log(`   Total Fines: ${fines.length}`);
    console.log('\n🎉 All data has been migrated to MongoDB Atlas!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

// Run migration
migrateData();
