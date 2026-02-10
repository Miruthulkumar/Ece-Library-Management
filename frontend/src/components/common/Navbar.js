import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import collegeLogo from "../../assets/college_logo.png";

const Navbar = () => {
  const { user, logout, isStudent, isFaculty, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src={collegeLogo}
            alt="College Logo"
            className="navbar-logo-img static"
          />
        </Link>

        {user && (
          <>
            <button className="navbar-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            <ul className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
              <li className={`navbar-link ${isActive("/")}`}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="navbar-link-icon">🏠</span>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className={`navbar-link ${isActive("/books")}`}>
                <Link to="/books" onClick={() => setMobileMenuOpen(false)}>
                  <span className="navbar-link-icon">📚</span>
                  <span>Books</span>
                </Link>
              </li>

              {(isStudent || isFaculty) && (
                <>
                  <li className={`navbar-link ${isActive("/my-books")}`}>
                    <Link
                      to="/my-books"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">📖</span>
                      <span>My Books</span>
                    </Link>
                  </li>
                  <li className={`navbar-link ${isActive("/reservations")}`}>
                    <Link
                      to="/reservations"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">🔖</span>
                      <span>Reservations</span>
                    </Link>
                  </li>
                </>
              )}

              {isLibrarian && (
                <>
                  <li className={`navbar-link ${isActive("/manage-books")}`}>
                    <Link
                      to="/manage-books"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">⚙️</span>
                      <span>Manage Books</span>
                    </Link>
                  </li>
                  <li
                    className={`navbar-link ${isActive("/manage-reservations")}`}
                  >
                    <Link
                      to="/manage-reservations"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">📋</span>
                      <span>Reservations</span>
                    </Link>
                  </li>
                  <li className={`navbar-link ${isActive("/manage-issues")}`}>
                    <Link
                      to="/manage-issues"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">📚</span>
                      <span>Issues & Returns</span>
                    </Link>
                  </li>
                  <li className={`navbar-link ${isActive("/manage-users")}`}>
                    <Link
                      to="/manage-users"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">👥</span>
                      <span>Manage Users</span>
                    </Link>
                  </li>
                  <li className={`navbar-link ${isActive("/analytics")}`}>
                    <Link
                      to="/analytics"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="navbar-link-icon">📊</span>
                      <span>Analytics</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="navbar-user" ref={userMenuRef}>
              <div
                className="navbar-user-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar-user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="navbar-user-details">
                  <div className="navbar-user-name">{user?.name}</div>
                  <div className="navbar-user-role">{user?.role}</div>
                </div>
                <span
                  className={`navbar-user-arrow ${userMenuOpen ? "open" : ""}`}
                >
                  ▼
                </span>
              </div>

              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => {
                      navigate("/change-password");
                      setUserMenuOpen(false);
                    }}
                  >
                    <span className="dropdown-icon">🔐</span>
                    <span>Change Password</span>
                  </button>
                  <div className="navbar-dropdown-divider"></div>
                  <button
                    className="navbar-dropdown-item logout-item"
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <span className="dropdown-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
