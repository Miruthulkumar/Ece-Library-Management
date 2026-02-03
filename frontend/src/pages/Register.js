import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    departmentId: "",
    phone: "",
    role: "student",
    year: "",
    section: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for email field validation
    if (name === 'email') {
      setFormData({
        ...formData,
        email: value,
      });
      
      // Check if email contains @ and validate domain
      if (value.includes('@')) {
        if (!value.endsWith('@mkce.ac.in')) {
          setEmailError('Please use your @mkce.ac.in email address');
        } else {
          setEmailError('');
        }
      } else {
        setEmailError('');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    // Validation
    if (!formData.email.endsWith('@mkce.ac.in')) {
      setEmailError('Please use your @mkce.ac.in email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      if (result.requiresApproval) {
        // Show success message and redirect to login
        setError(""); // Clear any errors
        alert(result.message);
        navigate("/login");
      } else {
        // Auto-login (old flow, shouldn't happen with new system)
        navigate("/");
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: '600px' }}>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎓</div>
            <h1 className="auth-title">Join Us</h1>
            <p className="auth-subtitle">Create your MKCE ECE Library account</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span className="auth-alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">👤</span>
                Select Your Role
              </label>
              <div className="role-selection">
                <div
                  className={`role-card ${formData.role === 'student' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                >
                  <span className="role-card-icon">🎓</span>
                  <p className="role-card-title">Student</p>
                </div>
                <div
                  className={`role-card ${formData.role === 'faculty' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'faculty' })}
                >
                  <span className="role-card-icon">👨‍🏫</span>
                  <p className="role-card-title">Faculty</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">✉️</span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="your.name@mkce.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={emailError ? { borderColor: '#ef4444' } : {}}
                />
                {emailError && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span>
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">📱</span>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🎫</span>
                Department ID
              </label>
              <input
                type="text"
                name="departmentId"
                className="form-control"
                placeholder="e.g., ECE2023001"
                value={formData.departmentId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Student-specific fields */}
            {formData.role === "student" && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">📅</span>
                    Year
                  </label>
                  <select
                    name="year"
                    className="form-control"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icon">📋</span>
                    Section
                  </label>
                  <select
                    name="section"
                    className="form-control"
                    value={formData.section}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🔐</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-loading">
                  <span className="auth-spinner"></span>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="card" style={{
            padding: '1rem',
            marginTop: '1.5rem',
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#1e40af',
              margin: 0,
              lineHeight: '1.6'
            }}>
              ℹ️ <strong>Note:</strong> Your account will be pending approval by the librarian.
              You'll be able to login once your account is activated.
            </p>
          </div>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-footer-link">
                Sign in here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
