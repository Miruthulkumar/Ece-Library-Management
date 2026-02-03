const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getPopularBooks,
  getLeastUsedBooks,
  getCategoryDistribution,
  getJLPTDemand,
  getActiveUsers,
  getIssueTrends,
  getPeakUsage,
  getFineStatistics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

// All analytics routes are librarian-only
router.use(protect, authorize("librarian"));

router.get("/dashboard", getDashboardStats);
router.get("/popular-books", getPopularBooks);
router.get("/least-used-books", getLeastUsedBooks);
router.get("/category-distribution", getCategoryDistribution);
router.get("/jlpt-demand", getJLPTDemand);
router.get("/active-users", getActiveUsers);
router.get("/issue-trends", getIssueTrends);
router.get("/peak-usage", getPeakUsage);
router.get("/fines", getFineStatistics);

module.exports = router;
