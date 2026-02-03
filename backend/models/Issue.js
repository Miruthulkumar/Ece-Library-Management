const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "issued", "returned", "overdue"],
    default: "pending",
  },
  remarks: {
    type: String,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approvedAt: {
    type: Date,
  },
  fine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fine",
  },
});

// Calculate if issue is overdue
issueSchema.methods.isOverdue = function () {
  if (this.status === "returned") return false;
  return new Date() > this.dueDate;
};

// Calculate fine amount
issueSchema.methods.calculateFine = function () {
  if (!this.isOverdue()) return 0;

  const currentDate = this.returnDate || new Date();
  const daysOverdue = Math.ceil(
    (currentDate - this.dueDate) / (1000 * 60 * 60 * 24),
  );
  const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 5;

  return daysOverdue * finePerDay;
};

// Update status based on due date
issueSchema.pre("save", function (next) {
  if (this.status === "issued" && new Date() > this.dueDate) {
    this.status = "overdue";
  }
  next();
});

module.exports = mongoose.model("Issue", issueSchema);
