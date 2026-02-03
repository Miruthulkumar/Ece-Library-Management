const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  approveReservation,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, authorize("librarian"), getAllReservations);

router.delete("/:id", protect, cancelReservation);
router.put("/:id/approve", protect, authorize("librarian"), approveReservation);

module.exports = router;
