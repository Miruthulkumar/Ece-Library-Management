import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, active, inactive
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/users/${userId}/toggle-status`);
      setSuccess(`User ${action}d successfully!`);
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} user`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await api.delete(`/users/${userId}`);
      setSuccess("User deleted successfully!");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowResetPasswordModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await api.put(`/users/${selectedUser._id}/reset-password`, {
        newPassword,
      });
      setSuccess(`Password reset successfully for ${selectedUser.name}!`);
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      setTimeout(() => setError(""), 3000);
    }
  };

  const filteredUsers = users.filter((user) => {
    // Don't show librarians in the list
    if (user.role === "librarian") return false;
    
    if (filter === "all") return true;
    if (filter === "pending") return !user.isActive;
    if (filter === "active") return user.isActive;
    if (filter === "inactive") return !user.isActive;
    return true;
  });

  const pendingCount = users.filter(u => !u.isActive && u.role !== "librarian").length;

  if (loading) return <Loader fullPage />;

  return (
    <div className="manage-users-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">👥 Manage Users</h1>
            <p className="page-subtitle">
              Approve, manage, and monitor user accounts
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="pending-badge">
              {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Users ({users.filter(u => u.role !== "librarian").length})
          </button>
          <button
            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({users.filter(u => u.isActive && u.role !== "librarian").length})
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅</span> {success}
          </div>
        )}

        <div className="users-table-container">
          {filteredUsers.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department ID</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-name-cell">
                        <strong>{user.name}</strong>
                        {user.role === "student" && user.year && user.section && (
                          <small>Year {user.year} - Section {user.section}</small>
                        )}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="dept-id">{user.departmentId}</span>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === "student" ? "🎓" : "👨‍🏫"} {user.role}
                      </span>
                    </td>
                    <td>{user.phone}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isActive ? "status-active" : "status-pending"
                        }`}
                      >
                        {user.isActive ? "✅ Active" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-reset-password"
                          onClick={() => openResetPasswordModal(user)}
                          title="Reset Password"
                        >
                          🔐
                        </button>
                        <button
                          className={`btn-action ${
                            user.isActive ? "btn-deactivate" : "btn-activate"
                          }`}
                          onClick={() =>
                            handleToggleStatus(user._id, user.isActive)
                          }
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? "🚫" : "✅"}
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3 className="empty-state-title">No Users Found</h3>
              <p className="empty-state-description">
                {filter === "pending"
                  ? "No pending user registrations"
                  : "No users match the selected filter"}
              </p>
            </div>
          )}
        </div>

        {/* Reset Password Modal */}
        {showResetPasswordModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🔐 Reset Password</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowResetPasswordModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleResetPassword} className="reset-password-form">
                <div className="user-info-box">
                  <p><strong>User:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    minLength="6"
                    autoFocus
                  />
                  <small className="form-hint">
                    ⚠️ This will reset the user's password without requiring their current password
                  </small>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowResetPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
