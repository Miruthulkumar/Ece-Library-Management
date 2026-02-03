const Book = require("../models/Book");

// @desc    Get all books
// @route   GET /api/books
// @access  Private
exports.getBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      subCategory,
      author,
      publisher,
      yearFrom,
      yearTo,
      availability,
      sortBy,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (author) {
      query.authors = { $regex: author, $options: "i" };
    }

    if (publisher) {
      query.publisher = { $regex: publisher, $options: "i" };
    }

    if (yearFrom || yearTo) {
      query.yearOfPublication = {};
      if (yearFrom) query.yearOfPublication.$gte = parseInt(yearFrom);
      if (yearTo) query.yearOfPublication.$lte = parseInt(yearTo);
    }

    if (availability === "available") {
      query.availableCopies = { $gt: 0 };
    } else if (availability === "unavailable") {
      query.availableCopies = 0;
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "title":
          sort = { title: 1 };
          break;
        case "year":
          sort = { yearOfPublication: -1 };
          break;
        case "popular":
          sort = { issueCount: -1 };
          break;
        case "recent":
          sort = { addedAt: -1 };
          break;
        default:
          sort = { title: 1 };
      }
    } else {
      sort = { title: 1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("addedBy", "name email");

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "addedBy",
      "name email",
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian only)
exports.createBook = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    req.body.availableCopies = req.body.totalCopies;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian only)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // If total copies are updated, adjust available copies
    if (req.body.totalCopies && req.body.totalCopies !== book.totalCopies) {
      const difference = req.body.totalCopies - book.totalCopies;
      req.body.availableCopies = book.availableCopies + difference;

      // Ensure available copies don't go negative
      if (req.body.availableCopies < 0) {
        req.body.availableCopies = 0;
      }
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Librarian only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Soft delete - mark as inactive
    book.isActive = false;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get book categories
// @route   GET /api/books/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
