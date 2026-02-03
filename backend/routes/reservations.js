const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  fulfillReservation,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, authorize("librarian"), getAllReservations);

router.delete("/:id", protect, cancelReservation);
router.put("/:id/fulfill", protect, authorize("librarian"), fulfillReservation);

module.exports = router;
