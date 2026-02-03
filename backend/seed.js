const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Book = require("./models/Book");

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Demo users data
const demoUsers = [
  {
    name: "Admin Librarian",
    email: "admin@ece.edu",
    password: "admin123",
    departmentId: "LIB001",
    phone: "1234567890",
    role: "librarian",
    isActive: true,
  },
  {
    name: "Test Student",
    email: "student@ece.edu",
    password: "student123",
    departmentId: "ECE001",
    phone: "9876543210",
    role: "student",
    year: 3,
    section: "A",
    isActive: true,
  },
  {
    name: "Test Faculty",
    email: "faculty@ece.edu",
    password: "faculty123",
    departmentId: "ECE-FAC001",
    phone: "9876543211",
    role: "faculty",
    isActive: true,
  },
];

// Sample books data
const sampleBooks = [
  // ECE Engineering Books
  {
    title: "Analog Electronic Circuits",
    authors: ["Thomas H. Floyd"],
    isbn: "9780262033848",
    publisher: "Pearson",
    yearOfPublication: 2020,
    edition: "3rd",
    category: "Analog Electronics",
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: "AE-001",
    description: "A comprehensive introduction to analog electronic circuits and systems.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51XvVJvfSQL._SX258_BO1,204,203,200_.jpg",
  },
  {
    title: "Digital Signal Processing",
    authors: ["John G. Proakis", "Dimitris G. Manolakis"],
    isbn: "9780131873742",
    publisher: "Pearson",
    yearOfPublication: 2019,
    edition: "4th",
    category: "Signals and Systems",
    totalCopies: 3,
    availableCopies: 3,
    shelfLocation: "SS-001",
    description: "Fundamentals of digital signal processing.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51H7K8F7G1L._SX377_BO1,204,203,200_.jpg",
  },
  {
    title: "Communication Systems",
    authors: ["Simon Haykin"],
    isbn: "9780471697909",
    publisher: "Wiley",
    yearOfPublication: 2021,
    edition: "5th",
    category: "Communication Systems",
    totalCopies: 4,
    availableCopies: 4,
    shelfLocation: "CS-001",
    description: "Comprehensive coverage of analog and digital communication systems.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51xQF0YP7ML._SX382_BO1,204,203,200_.jpg",
  },
  {
    title: "Microprocessors and Microcontrollers",
    authors: ["Krishna Kant"],
    isbn: "9788120323995",
    publisher: "PHI Learning",
    yearOfPublication: 2018,
    edition: "1st",
    category: "Microprocessors & Microcontrollers",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "MP-001",
    description: "Architecture, programming and system design of 8085 and 8086.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51JnZmEfZPL._SX363_BO1,204,203,200_.jpg",
  },
  {
    title: "VLSI Design Techniques",
    authors: ["Neil H.E. Weste", "David Harris"],
    isbn: "9780070634695",
    publisher: "Pearson",
    yearOfPublication: 2020,
    edition: "4th",
    category: "VLSI Design",
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: "VLSI-001",
    description: "Comprehensive study of VLSI design principles and techniques.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51fDl9zy0eL._SX385_BO1,204,203,200_.jpg",
  },
  {
    title: "Embedded Systems Design",
    authors: ["Frank Vahid", "Tony Givargis"],
    isbn: "9780471386780",
    publisher: "Wiley",
    yearOfPublication: 2019,
    edition: "2nd",
    category: "Embedded Systems",
    totalCopies: 4,
    availableCopies: 4,
    shelfLocation: "ES-001",
    description: "Introduction to embedded systems design and implementation.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/41KSPF0EVQL._SX377_BO1,204,203,200_.jpg",
  },
  
  // JLPT N5 Books
  {
    title: "Minna no Nihongo I - Main Textbook",
    authors: ["3A Network"],
    isbn: "9784883196036",
    publisher: "3A Corporation",
    yearOfPublication: 2012,
    edition: "2nd",
    category: "JLPT N5",
    subCategory: "Grammar",
    totalCopies: 10,
    availableCopies: 10,
    shelfLocation: "JP-N5-001",
    description: "Comprehensive Japanese language textbook for beginners (JLPT N5 level). Covers basic grammar patterns and conversation.",
    tags: ["Japanese", "JLPT", "N5", "Grammar", "Beginner"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51VvYx8KVRL._SX373_BO1,204,203,200_.jpg",
  },
  {
    title: "Minna no Nihongo I - Translation & Grammar Notes (English)",
    authors: ["3A Network"],
    isbn: "9784883196043",
    publisher: "3A Corporation",
    yearOfPublication: 2012,
    edition: "2nd",
    category: "JLPT N5",
    subCategory: "Grammar",
    totalCopies: 8,
    availableCopies: 8,
    shelfLocation: "JP-N5-002",
    description: "Grammar notes and translations for Minna no Nihongo I in English.",
    tags: ["Japanese", "JLPT", "N5", "Grammar", "Translation"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/41Z9FZ8KXPL._SX373_BO1,204,203,200_.jpg",
  },
  {
    title: "Genki I: An Integrated Course in Elementary Japanese",
    authors: ["Eri Banno", "Yoko Ikeda", "Yutaka Ohno"],
    isbn: "9784789014403",
    publisher: "The Japan Times",
    yearOfPublication: 2011,
    edition: "2nd",
    category: "JLPT N5",
    subCategory: "General",
    totalCopies: 8,
    availableCopies: 8,
    shelfLocation: "JP-N5-003",
    description: "Popular beginner-level textbook with integrated approach to learning Japanese.",
    tags: ["Japanese", "JLPT", "N5", "Beginner", "Comprehensive"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51QGKzVGZBL._SX382_BO1,204,203,200_.jpg",
  },
  {
    title: "Japanese Kanji for Beginners (JLPT N5)",
    authors: ["Timothy G. Stout", "Kaori Hakone"],
    isbn: "9784805311165",
    publisher: "Tuttle Publishing",
    yearOfPublication: 2015,
    edition: "1st",
    category: "JLPT N5",
    subCategory: "Kanji",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N5-004",
    description: "Learn the 100+ essential kanji characters for JLPT N5 level.",
    tags: ["Japanese", "JLPT", "N5", "Kanji", "Writing"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51YnXfCHGBL._SX396_BO1,204,203,200_.jpg",
  },
  {
    title: "Quick Mastery of Vocabulary (N5 Level)",
    authors: ["Tomoko Hiki"],
    isbn: "9784893588951",
    publisher: "J-Research Publishing",
    yearOfPublication: 2013,
    edition: "1st",
    category: "JLPT N5",
    subCategory: "Vocabulary",
    totalCopies: 7,
    availableCopies: 7,
    shelfLocation: "JP-N5-005",
    description: "Essential vocabulary for JLPT N5 with exercises and audio support.",
    tags: ["Japanese", "JLPT", "N5", "Vocabulary"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51wKqH4ZFSL._SX350_BO1,204,203,200_.jpg",
  },

  // JLPT N4 Books
  {
    title: "Minna no Nihongo II - Main Textbook",
    authors: ["3A Network"],
    isbn: "9784883196463",
    publisher: "3A Corporation",
    yearOfPublication: 2013,
    edition: "2nd",
    category: "JLPT N4",
    subCategory: "Grammar",
    totalCopies: 8,
    availableCopies: 8,
    shelfLocation: "JP-N4-001",
    description: "Continuation of Minna no Nihongo series for intermediate level (JLPT N4).",
    tags: ["Japanese", "JLPT", "N4", "Grammar", "Intermediate"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51w7qZV8PqL._SX373_BO1,204,203,200_.jpg",
  },
  {
    title: "Genki II: An Integrated Course in Elementary Japanese",
    authors: ["Eri Banno", "Yoko Ikeda", "Yutaka Ohno"],
    isbn: "9784789014410",
    publisher: "The Japan Times",
    yearOfPublication: 2011,
    edition: "2nd",
    category: "JLPT N4",
    subCategory: "General",
    totalCopies: 7,
    availableCopies: 7,
    shelfLocation: "JP-N4-002",
    description: "Second volume of the popular Genki series, covering N4 level grammar.",
    tags: ["Japanese", "JLPT", "N4", "Grammar", "Comprehensive"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51wKy3PHSJL._SX382_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanji Look and Learn (N4 Level)",
    authors: ["Eri Banno"],
    isbn: "9784789013499",
    publisher: "The Japan Times",
    yearOfPublication: 2009,
    edition: "1st",
    category: "JLPT N4",
    subCategory: "Kanji",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N4-003",
    description: "Learn 512 essential kanji characters with illustrations and mnemonics.",
    tags: ["Japanese", "JLPT", "N4", "Kanji", "Visual Learning"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51dVQZ5JCQL._SX389_BO1,204,203,200_.jpg",
  },
  {
    title: "Quick Mastery of Vocabulary (N4 Level)",
    authors: ["Tomoko Hiki"],
    isbn: "9784893588968",
    publisher: "J-Research Publishing",
    yearOfPublication: 2014,
    edition: "1st",
    category: "JLPT N4",
    subCategory: "Vocabulary",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N4-004",
    description: "Essential N4 vocabulary organized by theme with practice exercises.",
    tags: ["Japanese", "JLPT", "N4", "Vocabulary"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51H9XJZQ8YL._SX350_BO1,204,203,200_.jpg",
  },

  // JLPT N3 Books
  {
    title: "So-matome: Essential Practice for JLPT N3 Grammar",
    authors: ["Hitoko Sasaki", "Noriko Matsumoto"],
    isbn: "9784872177312",
    publisher: "Ask Publishing",
    yearOfPublication: 2010,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Grammar",
    totalCopies: 8,
    availableCopies: 8,
    shelfLocation: "JP-N3-001",
    description: "6-week grammar preparation book covering all N3 grammar points.",
    tags: ["Japanese", "JLPT", "N3", "Grammar", "Test Prep"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51rKz5z0KDL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "So-matome: Essential Practice for JLPT N3 Vocabulary",
    authors: ["Hitoko Sasaki"],
    isbn: "9784872177329",
    publisher: "Ask Publishing",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Vocabulary",
    totalCopies: 8,
    availableCopies: 8,
    shelfLocation: "JP-N3-002",
    description: "Essential vocabulary for JLPT N3 organized by topics and themes.",
    tags: ["Japanese", "JLPT", "N3", "Vocabulary"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51Z9KN7VGZL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "So-matome: Essential Practice for JLPT N3 Kanji",
    authors: ["Hitoko Sasaki"],
    isbn: "9784872177336",
    publisher: "Ask Publishing",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Kanji",
    totalCopies: 7,
    availableCopies: 7,
    shelfLocation: "JP-N3-003",
    description: "Master 370 kanji characters required for JLPT N3 in 6 weeks.",
    tags: ["Japanese", "JLPT", "N3", "Kanji"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51tP9YZH8DL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "So-matome: Essential Practice for JLPT N3 Reading Comprehension",
    authors: ["Hitoko Sasaki"],
    isbn: "9784872177343",
    publisher: "Ask Publishing",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Reading",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N3-004",
    description: "Improve reading comprehension skills for JLPT N3 level texts.",
    tags: ["Japanese", "JLPT", "N3", "Reading"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51XGQZ1Y0HL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanzen Master Grammar: JLPT N3",
    authors: ["Tomoko Ishii", "Machiko Kano"],
    isbn: "9784883196562",
    publisher: "3A Corporation",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Grammar",
    totalCopies: 7,
    availableCopies: 7,
    shelfLocation: "JP-N3-005",
    description: "Complete grammar reference and practice for JLPT N3 preparation.",
    tags: ["Japanese", "JLPT", "N3", "Grammar", "Comprehensive"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51VzC0FpkCL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanzen Master Vocabulary: JLPT N3",
    authors: ["Noriko Matsumoto"],
    isbn: "9784883195732",
    publisher: "3A Corporation",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Vocabulary",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N3-006",
    description: "Systematic approach to learning N3 vocabulary with context and usage.",
    tags: ["Japanese", "JLPT", "N3", "Vocabulary"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51qXZ8NVYJL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanzen Master Kanji: JLPT N3",
    authors: ["Sachiko Miyata", "Sayoko Takahashi"],
    isbn: "9784883195749",
    publisher: "3A Corporation",
    yearOfPublication: 2012,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Kanji",
    totalCopies: 6,
    availableCopies: 6,
    shelfLocation: "JP-N3-007",
    description: "Complete kanji study guide for JLPT N3 with readings and compounds.",
    tags: ["Japanese", "JLPT", "N3", "Kanji"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51Z8F9XHYJL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanzen Master Reading Comprehension: JLPT N3",
    authors: ["Yoshiko Fukuoka", "Tomoko Kiyama"],
    isbn: "9784883195756",
    publisher: "3A Corporation",
    yearOfPublication: 2011,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Reading",
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: "JP-N3-008",
    description: "Develop reading comprehension skills through various text types.",
    tags: ["Japanese", "JLPT", "N3", "Reading"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51PQ7F8QZZL._SX350_BO1,204,203,200_.jpg",
  },
  {
    title: "Kanzen Master Listening Comprehension: JLPT N3",
    authors: ["Chiaki Nakamura", "Yoko Yamada"],
    isbn: "9784883196579",
    publisher: "3A Corporation",
    yearOfPublication: 2012,
    edition: "1st",
    category: "JLPT N3",
    subCategory: "Listening",
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: "JP-N3-009",
    description: "Listening practice with CD for JLPT N3 exam preparation.",
    tags: ["Japanese", "JLPT", "N3", "Listening", "Audio"],
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/51H7YBXQY2L._SX350_BO1,204,203,200_.jpg",
  },
];

// Seed database
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("\n🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log("✅ Existing data cleared");

    console.log("\n👥 Creating demo users...");
    const createdUsers = await User.create(demoUsers);
    console.log(`✅ ${createdUsers.length} demo users created`);
    createdUsers.forEach((user) => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log("\n📚 Creating sample books...");
    const createdBooks = await Book.create(sampleBooks);
    console.log(`✅ ${createdBooks.length} sample books created`);
    console.log(`   ECE Engineering Books: ${createdBooks.filter(b => !b.category.includes('JLPT')).length}`);
    console.log(`   JLPT N5 Books: ${createdBooks.filter(b => b.category === 'JLPT N5').length}`);
    console.log(`   JLPT N4 Books: ${createdBooks.filter(b => b.category === 'JLPT N4').length}`);
    console.log(`   JLPT N3 Books: ${createdBooks.filter(b => b.category === 'JLPT N3').length}`);

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📝 Demo Credentials:");
    console.log("   Librarian: admin@ece.edu / admin123");
    console.log("   Student: student@ece.edu / student123");
    console.log("   Faculty: faculty@ece.edu / faculty123");

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
