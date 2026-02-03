const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
} = require("../controllers/bookController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

router
  .route("/")
  .get(protect, getBooks)
  .post(protect, authorize("librarian"), createBook);

router.get("/categories", protect, getCategories);

router
  .route("/:id")
  .get(protect, getBook)
  .put(protect, authorize("librarian"), updateBook)
  .delete(protect, authorize("librarian"), deleteBook);

module.exports = router;
