const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
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
  reservationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "available", "fulfilled", "cancelled", "expired"],
    default: "pending",
  },
  queuePosition: {
    type: Number,
    required: true,
  },
  notifiedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
  fulfilledAt: {
    type: Date,
  },
  remarks: {
    type: String,
  },
});

// Check if reservation is expired (24 hours after notification)
reservationSchema.methods.isExpired = function () {
  if (this.status !== "available") return false;
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Mark as available and set expiry
reservationSchema.methods.markAvailable = function () {
  this.status = "available";
  this.notifiedAt = new Date();
  this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
};

module.exports = mongoose.model("Reservation", reservationSchema);
