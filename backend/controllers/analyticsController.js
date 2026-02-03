const Book = require("../models/Book");
const Issue = require("../models/Issue");
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Fine = require("../models/Fine");

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Librarian)
exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalIssues = await Issue.countDocuments();
    const activeIssues = await Issue.countDocuments({
      status: { $in: ["issued", "overdue"] },
    });

    // Books statistics
    const availableBooks = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$availableCopies" } } },
    ]);

    const totalAvailable = availableBooks[0]?.total || 0;

    // Overdue statistics
    const overdueCount = await Issue.countDocuments({
      status: { $in: ["issued", "overdue"] },
      dueDate: { $lt: new Date() },
    });

    // Pending approvals
    const pendingIssues = await Issue.countDocuments({ status: "pending" });
    const pendingReservations = await Reservation.countDocuments({
      status: "pending",
    });

    // Fine statistics
    const fineStats = await Fine.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalPendingFines = fineStats[0]?.total || 0;

    // User role distribution
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$role", count: { $count: {} } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalUsers,
        totalIssues,
        activeIssues,
        totalAvailable,
        overdueCount,
        pendingIssues,
        pendingReservations,
        totalPendingFines,
        usersByRole,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get most borrowed books
// @route   GET /api/analytics/popular-books
// @access  Private (Librarian)
exports.getPopularBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularBooks = await Book.find({ isActive: true })
      .sort({ issueCount: -1 })
      .limit(limit)
      .select("title authors category issueCount");

    res.status(200).json({
      success: true,
      data: popularBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get least used books
// @route   GET /api/analytics/least-used-books
// @access  Private (Librarian)
exports.getLeastUsedBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const leastUsedBooks = await Book.find({ isActive: true })
      .sort({ issueCount: 1 })
      .limit(limit)
      .select("title authors category issueCount addedAt");

    res.status(200).json({
      success: true,
      data: leastUsedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get category-wise book distribution
// @route   GET /api/analytics/category-distribution
// @access  Private (Librarian)
exports.getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await Book.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          totalBooks: { $sum: 1 },
          totalCopies: { $sum: "$totalCopies" },
          availableCopies: { $sum: "$availableCopies" },
          totalIssues: { $sum: "$issueCount" },
        },
      },
      { $sort: { totalBooks: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get JLPT books demand analysis
// @route   GET /api/analytics/jlpt-demand
// @access  Private (Librarian)
exports.getJLPTDemand = async (req, res) => {
  try {
    const jlptLevels = ["JLPT N5", "JLPT N4", "JLPT N3"];

    const demandData = await Issue.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $match: {
          "bookDetails.category": { $in: jlptLevels },
        },
      },
      {
        $group: {
          _id: {
            category: "$bookDetails.category",
            subCategory: "$bookDetails.subCategory",
          },
          count: { $count: {} },
        },
      },
      { $sort: { "_id.category": 1, count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: demandData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get active users
// @route   GET /api/analytics/active-users
// @access  Private (Librarian)
exports.getActiveUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const activeUsers = await Issue.aggregate([
      {
        $group: {
          _id: "$user",
          issueCount: { $count: {} },
          activeIssues: {
            $sum: {
              $cond: [{ $in: ["$status", ["issued", "overdue"]] }, 1, 0],
            },
          },
        },
      },
      { $sort: { issueCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          name: "$userDetails.name",
          email: "$userDetails.email",
          role: "$userDetails.role",
          departmentId: "$userDetails.departmentId",
          issueCount: 1,
          activeIssues: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: activeUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get issue trends
// @route   GET /api/analytics/issue-trends
// @access  Private (Librarian)
exports.getIssueTrends = async (req, res) => {
  try {
    const { period = "month" } = req.query; // month, week, year

    let groupBy;
    switch (period) {
      case "week":
        groupBy = {
          year: { $year: "$issueDate" },
          week: { $week: "$issueDate" },
        };
        break;
      case "year":
        groupBy = {
          year: { $year: "$issueDate" },
        };
        break;
      default: // month
        groupBy = {
          year: { $year: "$issueDate" },
          month: { $month: "$issueDate" },
        };
    }

    const trends = await Issue.aggregate([
      {
        $group: {
          _id: groupBy,
          totalIssues: { $count: {} },
          returned: {
            $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
          },
          overdue: {
            $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.week": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: trends.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get peak usage periods
// @route   GET /api/analytics/peak-usage
// @access  Private (Librarian)
exports.getPeakUsage = async (req, res) => {
  try {
    const hourlyUsage = await Issue.aggregate([
      {
        $group: {
          _id: { $hour: "$issueDate" },
          count: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dayOfWeekUsage = await Issue.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$issueDate" },
          count: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyUsage = await Issue.aggregate([
      {
        $group: {
          _id: { $month: "$issueDate" },
          count: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        hourly: hourlyUsage,
        dayOfWeek: dayOfWeekUsage,
        monthly: monthlyUsage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get fine statistics
// @route   GET /api/analytics/fines
// @access  Private (Librarian)
exports.getFineStatistics = async (req, res) => {
  try {
    const fineStats = await Fine.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $count: {} },
        },
      },
    ]);

    const totalCollected = await Fine.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $month: "$paidAt" },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: fineStats,
        monthlyCollection: totalCollected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
