const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");
const Fine = require("../models/Fine");
const Reservation = require("../models/Reservation");

// @desc    Request book issue
// @route   POST /api/issues
// @access  Private
exports.requestIssue = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is currently unavailable. You can reserve it instead.",
      });
    }

    // Check user's issue limit
    const userIssueCount = await Issue.countDocuments({
      user: userId,
      status: { $in: ["pending", "issued", "overdue"] },
    });

    const issueLimit = req.user.getIssueLimit();
    if (userIssueCount >= issueLimit) {
      return res.status(400).json({
        success: false,
        message: `You have reached your issue limit of ${issueLimit} books`,
      });
    }

    // Check if user has pending fines
    if (req.user.totalFineAmount > 0) {
      return res.status(400).json({
        success: false,
        message: "Please clear your pending fines before issuing new books",
      });
    }

    // Calculate due date based on user role
    const issueDuration = req.user.getIssueDuration();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + issueDuration);

    // Create issue request
    const issue = await Issue.create({
      user: userId,
      book: bookId,
      dueDate,
      status: "pending",
    });

    await issue.populate("book");

    res.status(201).json({
      success: true,
      message:
        "Issue request submitted successfully. Waiting for librarian approval.",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all issue requests
// @route   GET /api/issues
// @access  Private (Librarian)
exports.getAllIssues = async (req, res) => {
  try {
    const { status, userId, bookId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;
    if (bookId) query.book = bookId;

    const issues = await Issue.find(query)
      .populate("user", "name email departmentId role")
      .populate("book", "title authors isbn category")
      .populate("approvedBy", "name")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/my
// @access  Private
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id })
      .populate("book", "title authors isbn category shelfLocation")
      .populate("fine")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve issue request
// @route   PUT /api/issues/:id/approve
// @access  Private (Librarian)
exports.approveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue request not found",
      });
    }

    if (issue.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This issue request has already been processed",
      });
    }

    // Check book availability
    const book = await Book.findById(issue.book);
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is no longer available",
      });
    }

    // Update issue
    issue.status = "issued";
    issue.approvedBy = req.user.id;
    issue.approvedAt = new Date();
    await issue.save();

    // Update book availability
    book.availableCopies -= 1;
    book.issueCount += 1;
    await book.save();

    // Update user's issued books
    await User.findByIdAndUpdate(issue.user, {
      $push: { booksIssued: issue._id },
    });

    await issue.populate(["book", "user"]);

    res.status(200).json({
      success: true,
      message: "Book issued successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject issue request
// @route   PUT /api/issues/:id/reject
// @access  Private (Librarian)
exports.rejectIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue request not found",
      });
    }

    if (issue.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This issue request has already been processed",
      });
    }

    issue.status = "cancelled";
    issue.remarks = req.body.remarks || "Rejected by librarian";
    await issue.save();

    res.status(200).json({
      success: true,
      message: "Issue request rejected",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Return book
// @route   PUT /api/issues/:id/return
// @access  Private (Librarian)
exports.returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    if (issue.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book has already been returned",
      });
    }

    issue.returnDate = new Date();
    issue.status = "returned";

    // Calculate fine if overdue
    const fineAmount = issue.calculateFine();
    if (fineAmount > 0) {
      const fine = await Fine.create({
        user: issue.user,
        issue: issue._id,
        amount: fineAmount,
      });
      issue.fine = fine._id;

      // Update user's total fine amount
      await User.findByIdAndUpdate(issue.user, {
        $inc: { totalFineAmount: fineAmount },
        $push: { fines: fine._id },
      });
    }

    await issue.save();

    // Update book availability
    const book = await Book.findById(issue.book);
    book.availableCopies += 1;
    await book.save();

    // Check if any reservations are waiting
    const reservation = await Reservation.findOne({
      book: issue.book,
      status: "pending",
    }).sort({ queuePosition: 1 });

    if (reservation) {
      reservation.markAvailable();
      await reservation.save();
      // TODO: Send notification to user
    }

    await issue.populate(["book", "user", "fine"]);

    res.status(200).json({
      success: true,
      message:
        fineAmount > 0
          ? `Book returned with fine of ₹${fineAmount}`
          : "Book returned successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get overdue books
// @route   GET /api/issues/overdue
// @access  Private (Librarian)
exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueIssues = await Issue.find({
      status: { $in: ["issued", "overdue"] },
      dueDate: { $lt: new Date() },
    })
      .populate("user", "name email departmentId phone")
      .populate("book", "title authors isbn")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: overdueIssues.length,
      data: overdueIssues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
