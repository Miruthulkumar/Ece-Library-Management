const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  updateDetails,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);
router.put("/updatedetails", protect, updateDetails);

module.exports = router;
