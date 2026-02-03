import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatDate, getStatusBadgeClass } from "../utils/helpers";
import Loader from "../components/common/Loader";
import "./Home.css";

const Home = () => {
  const { user, isStudent, isFaculty, isLibrarian } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      if (isLibrarian) {
        const res = await api.get("/analytics/dashboard");
        setStats(res.data.data);
      }

      const issuesRes = await api.get("/issues/my");
      setRecentIssues(issuesRes.data.data.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="home-container">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-badge">
            {isLibrarian && "👑 Administrator"}
            {isFaculty && "👨‍🏫 Faculty Member"}
            {isStudent && "🎓 Student"}
          </div>
          <h1 className="dashboard-title">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="dashboard-subtitle">
            {isLibrarian && "Manage your library efficiently with powerful tools"}
            {isFaculty && "Explore our extensive collection of academic resources"}
            {isStudent && "Continue your learning journey with us"}
          </p>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">
                {user?.departmentId} • {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Librarian Dashboard */}
        {isLibrarian && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-primary">📚</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalBooks}</div>
                  <div className="stat-label">Total Books</div>
                  <div className="stat-trend">
                    ↑ {stats.totalAvailable} Available
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-success">👥</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Active Users</div>
                  <div className="stat-trend">
                    ↑ Growing Community
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-warning">📖</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.activeIssues}</div>
                  <div className="stat-label">Active Issues</div>
                  <div className="stat-trend">
                    ⚡ {stats.pendingIssues} Pending
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-info">⏰</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.overdueCount}</div>
                  <div className="stat-label">Overdue Books</div>
                  <div className="stat-trend">
                    ₹{stats.totalPendingFines} Fines
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2 className="section-title">⚡ Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/manage-books" className="action-card">
                  <span className="action-icon">➕</span>
                  <h3 className="action-title">Add Book</h3>
                  <p className="action-description">Add new books to collection</p>
                </Link>

                <Link to="/manage-users" className="action-card">
                  <span className="action-icon">✅</span>
                  <h3 className="action-title">Approve Users</h3>
                  <p className="action-description">Pending registrations</p>
                </Link>

                <Link to="/manage-users" className="action-card">
                  <span className="action-icon">👥</span>
                  <h3 className="action-title">Manage Users</h3>
                  <p className="action-description">View all members</p>
                </Link>

                <Link to="/analytics" className="action-card">
                  <span className="action-icon">📊</span>
                  <h3 className="action-title">Analytics</h3>
                  <p className="action-description">View detailed reports</p>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Student/Faculty Dashboard */}
        {(isStudent || isFaculty) && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-primary">📖</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {recentIssues.filter((i) =>
                      ["issued", "overdue"].includes(i.status)
                    ).length}
                  </div>
                  <div className="stat-label">Books Issued</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-success">✅</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {recentIssues.filter((i) => i.status === "returned").length}
                  </div>
                  <div className="stat-label">Books Returned</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-info">🎯</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{isFaculty ? "5" : "3"}</div>
                  <div className="stat-label">Issue Limit</div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2 className="section-title">⚡ Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/books" className="action-card">
                  <span className="action-icon">🔍</span>
                  <h3 className="action-title">Browse Books</h3>
                  <p className="action-description">Search our collection</p>
                </Link>

                <Link to="/my-books" className="action-card">
                  <span className="action-icon">📚</span>
                  <h3 className="action-title">My Books</h3>
                  <p className="action-description">View issued books</p>
                </Link>

                <Link to="/reservations" className="action-card">
                  <span className="action-icon">🔖</span>
                  <h3 className="action-title">Reservations</h3>
                  <p className="action-description">Manage queue</p>
                </Link>

                <Link to="/profile" className="action-card">
                  <span className="action-icon">👤</span>
                  <h3 className="action-title">My Profile</h3>
                  <p className="action-description">Update details</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            {recentIssues.length > 0 ? (
              <div className="recent-activity">
                <h2 className="section-title">📋 Recent Activity</h2>
                {recentIssues.map((issue) => (
                  <div key={issue._id} className="activity-item">
                    <div className="activity-icon">📕</div>
                    <div className="activity-content">
                      <div className="activity-title">
                        {issue.book?.title || "Book Title"}
                      </div>
                      <div className="activity-time">
                        Due: {formatDate(issue.dueDate)}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3 className="empty-state-title">No Active Books</h3>
                <p className="empty-state-description">
                  Start exploring our collection and issue your first book!
                </p>
                <Link to="/books" className="btn btn-primary">
                  Browse Books
                </Link>
              </div>
            )}
          </>
        )}

        {/* Categories Section */}
        <div className="quick-actions" style={{ marginTop: '3rem' }}>
          <h2 className="section-title">📚 Book Categories</h2>
          <div className="actions-grid">
            <div className="action-card">
              <span className="action-icon">⚡</span>
              <h3 className="action-title">ECE Core</h3>
              <p className="action-description">10+ subject categories</p>
            </div>

            <div className="action-card">
              <span className="action-icon">🇯🇵</span>
              <h3 className="action-title">JLPT</h3>
              <p className="action-description">N5, N4, N3 levels</p>
            </div>

            <div className="action-card">
              <span className="action-icon">💻</span>
              <h3 className="action-title">Digital</h3>
              <p className="action-description">E-books & resources</p>
            </div>

            <div className="action-card">
              <span className="action-icon">📖</span>
              <h3 className="action-title">Reference</h3>
              <p className="action-description">Study materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
