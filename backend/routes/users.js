const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserFines,
  payFine,
  waiveFine,
  toggleUserStatus,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  authorize,
  checkOwnershipOrLibrarian,
} = require("../middleware/roleCheck");

router.get("/", protect, authorize("librarian"), getAllUsers);

router
  .route("/:id")
  .get(protect, checkOwnershipOrLibrarian, getUser)
  .put(protect, authorize("librarian"), updateUser)
  .delete(protect, authorize("librarian"), deleteUser);

router.get("/:id/fines", protect, checkOwnershipOrLibrarian, getUserFines);
router.put("/:id/fines/:fineId/pay", protect, authorize("librarian"), payFine);
router.put(
  "/:id/fines/:fineId/waive",
  protect,
  authorize("librarian"),
  waiveFine,
);
router.put("/:id/toggle-status", protect, authorize("librarian"), toggleUserStatus);

module.exports = router;
