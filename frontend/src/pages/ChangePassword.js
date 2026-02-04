import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.put("/users/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(res.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-container">
          <div className="change-password-header">
            <div className="password-icon">🔐</div>
            <h1 className="page-title">Change Password</h1>
            <p className="page-subtitle">Update your account security</p>
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

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🔑</span>
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🔒</span>
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Enter new password (min. 6 characters)"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🔐</span>
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    Updating...
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>

          <div className="password-tips">
            <h3>Password Tips</h3>
            <ul>
              <li>Use at least 6 characters</li>
              <li>Mix uppercase and lowercase letters</li>
              <li>Include numbers and special characters</li>
              <li>Avoid common words or patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
