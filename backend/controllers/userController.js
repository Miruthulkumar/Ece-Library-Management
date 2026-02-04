const User = require("../models/User");
const Issue = require("../models/Issue");
const Fine = require("../models/Fine");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Librarian)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { departmentId: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Librarian or own profile)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "booksIssued",
        populate: { path: "book", select: "title authors isbn" },
      })
      .populate({
        path: "reservations",
        populate: { path: "book", select: "title authors isbn" },
      })
      .populate({
        path: "fines",
        populate: { path: "issue" },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Librarian)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, year, section, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, year, section, isActive },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Librarian)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has active issues
    const activeIssues = await Issue.countDocuments({
      user: req.params.id,
      status: { $in: ["pending", "issued", "overdue"] },
    });

    if (activeIssues > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete user with active book issues. Please return all books first.",
      });
    }

    // Check if user has pending fines
    if (user.totalFineAmount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete user with pending fines. Please clear all fines first.",
      });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's fines
// @route   GET /api/users/:id/fines
// @access  Private
exports.getUserFines = async (req, res) => {
  try {
    const fines = await Fine.find({ user: req.params.id })
      .populate({
        path: "issue",
        populate: { path: "book", select: "title authors isbn" },
      })
      .populate("processedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fines.length,
      data: fines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Pay fine
// @route   PUT /api/users/:id/fines/:fineId/pay
// @access  Private (Librarian)
exports.payFine = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const fine = await Fine.findById(req.params.fineId);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    if (fine.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Fine has already been paid",
      });
    }

    fine.status = "paid";
    fine.paidAt = new Date();
    fine.paymentMethod = paymentMethod || "cash";
    fine.processedBy = req.user.id;
    await fine.save();

    // Update user's total fine amount
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { totalFineAmount: -fine.amount },
    });

    res.status(200).json({
      success: true,
      message: "Fine paid successfully",
      data: fine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Waive fine
// @route   PUT /api/users/:id/fines/:fineId/waive
// @access  Private (Librarian)
exports.waiveFine = async (req, res) => {
  try {
    const { remarks } = req.body;
    const fine = await Fine.findById(req.params.fineId);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    if (fine.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending fines can be waived",
      });
    }

    fine.status = "waived";
    fine.paymentMethod = "waived";
    fine.remarks = remarks;
    fine.processedBy = req.user.id;
    fine.paidAt = new Date();
    await fine.save();

    // Update user's total fine amount
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { totalFineAmount: -fine.amount },
    });

    res.status(200).json({
      success: true,
      message: "Fine waived successfully",
      data: fine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change own password
// @route   PUT /api/users/change-password
// @access  Private (Any authenticated user)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Admin reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Private (Librarian only)
exports.adminResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password without current password verification
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle user active status (approve/deactivate)
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Librarian)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle the isActive status
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
