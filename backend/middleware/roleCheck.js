// Role-based access control middleware

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user is student
exports.isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only students can access this route",
    });
  }
  next();
};

// Check if user is faculty
exports.isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Only faculty members can access this route",
    });
  }
  next();
};

// Check if user is librarian
exports.isLibrarian = (req, res, next) => {
  if (req.user.role !== "librarian") {
    return res.status(403).json({
      success: false,
      message: "Only librarians can access this route",
    });
  }
  next();
};

// Check if user is faculty or librarian
exports.isFacultyOrLibrarian = (req, res, next) => {
  if (!["faculty", "librarian"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only faculty or librarians can access this route",
    });
  }
  next();
};

// Check if user can access their own resources or is librarian
exports.checkOwnershipOrLibrarian = (req, res, next) => {
  const userId = req.params.userId || req.params.id;

  if (req.user.role === "librarian" || req.user._id.toString() === userId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this resource",
    });
  }
};
