const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "faculty", "librarian"],
    default: "student",
  },
  departmentId: {
    type: String,
    required: [true, "Please provide department ID"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide phone number"],
  },
  year: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
  },
  section: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  booksIssued: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  fines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fine",
    },
  ],
  totalFineAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get issue limit based on role
userSchema.methods.getIssueLimit = function () {
  return this.role === "faculty" ? 5 : 3;
};

// Get issue duration based on role
userSchema.methods.getIssueDuration = function () {
  return this.role === "faculty" ? 30 : 14;
};

module.exports = mongoose.model("User", userSchema);
