const express = require("express");
const router = express.Router();
const {
  requestIssue,
  getAllIssues,
  getMyIssues,
  approveIssue,
  rejectIssue,
  returnBook,
  getOverdueBooks,
  requestReturn,
} = require("../controllers/issueController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

router.post("/", protect, requestIssue);
router.get("/", protect, authorize("librarian"), getAllIssues);
router.get("/my", protect, getMyIssues);
router.get("/overdue", protect, authorize("librarian"), getOverdueBooks);

router.put("/:id/approve", protect, authorize("librarian"), approveIssue);
router.put("/:id/reject", protect, authorize("librarian"), rejectIssue);
router.put("/:id/request-return", protect, requestReturn);
router.put("/:id/return", protect, authorize("librarian"), returnBook);

module.exports = router;
