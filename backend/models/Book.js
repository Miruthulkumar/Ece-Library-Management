const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide book title"],
    trim: true,
  },
  authors: [
    {
      type: String,
      required: [true, "Please provide at least one author"],
    },
  ],
  publisher: {
    type: String,
    required: [true, "Please provide publisher name"],
  },
  yearOfPublication: {
    type: Number,
    required: [true, "Please provide year of publication"],
  },
  edition: {
    type: String,
    default: "1st",
  },
  isbn: {
    type: String,
    required: [true, "Please provide ISBN"],
    unique: true,
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
    enum: [
      "Analog Electronics",
      "Digital Electronics",
      "Communication Systems",
      "Signals and Systems",
      "VLSI Design",
      "Embedded Systems",
      "Microprocessors & Microcontrollers",
      "Antennas & RF Engineering",
      "Control Systems",
      "Internet of Things",
      "JLPT N5",
      "JLPT N4",
      "JLPT N3",
    ],
  },
  subCategory: {
    type: String,
    enum: ["Vocabulary", "Grammar", "Kanji", "Reading", "Listening", "General"],
    default: "General",
  },
  totalCopies: {
    type: Number,
    required: [true, "Please provide total number of copies"],
    min: 1,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
  shelfLocation: {
    type: String,
    required: [true, "Please provide shelf location"],
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
    default: "default-book-cover.jpg",
  },
  tags: [String],
  issueCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUpdated before save
bookSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

// Check if book is Japanese language book
bookSchema.methods.isJapaneseBook = function () {
  return this.category.includes("JLPT");
};

// Check availability
bookSchema.methods.isAvailable = function () {
  return this.availableCopies > 0;
};

module.exports = mongoose.model("Book", bookSchema);
