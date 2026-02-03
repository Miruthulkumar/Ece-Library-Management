const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user already has a reservation for this book
    const existingReservation = await Reservation.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["pending", "available"] },
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "You already have an active reservation for this book",
      });
    }

    // Get queue position
    const queuePosition =
      (await Reservation.countDocuments({
        book: bookId,
        status: "pending",
      })) + 1;

    const reservation = await Reservation.create({
      user: userId,
      book: bookId,
      queuePosition,
    });

    await reservation.populate("book", "title authors isbn");

    res.status(201).json({
      success: true,
      message: `Reservation created. You are at position ${queuePosition} in the queue.`,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/my
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("book", "title authors isbn category")
      .sort({ reservationDate: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private (Librarian)
exports.getAllReservations = async (req, res) => {
  try {
    const { status, bookId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (bookId) query.book = bookId;

    const reservations = await Reservation.find(query)
      .populate("user", "name email departmentId role")
      .populate("book", "title authors isbn")
      .sort({ queuePosition: 1, reservationDate: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Check if user owns this reservation or is librarian
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "librarian"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this reservation",
      });
    }

    if (
      reservation.status === "fulfilled" ||
      reservation.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This reservation has already been processed",
      });
    }

    const bookId = reservation.book;
    const cancelledPosition = reservation.queuePosition;

    reservation.status = "cancelled";
    await reservation.save();

    // Update queue positions for remaining reservations
    await Reservation.updateMany(
      {
        book: bookId,
        status: "pending",
        queuePosition: { $gt: cancelledPosition },
      },
      {
        $inc: { queuePosition: -1 },
      },
    );

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark reservation as fulfilled
// @route   PUT /api/reservations/:id/fulfill
// @access  Private (Librarian)
exports.fulfillReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This reservation is not available for fulfillment",
      });
    }

    reservation.status = "fulfilled";
    reservation.fulfilledAt = new Date();
    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation fulfilled successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
