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
            Welcome, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="dashboard-subtitle">
            {isLibrarian && "Manage your library efficiently"}
            {isFaculty && "Explore our academic resources"}
            {isStudent && "Continue your learning journey"}
          </p>
        </div>

        {/* Librarian Dashboard */}
        {isLibrarian && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalBooks}</div>
                  <div className="stat-label">Total Books</div>
                  <div className="stat-trend">
                    ↑ {stats.totalAvailable} Available
                  </div>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Active Users</div>
                  <div className="stat-trend">↑ Growing</div>
                </div>
              </div>

              <div className="stat-card stat-warning">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.activeIssues}</div>
                  <div className="stat-label">Active Issues</div>
                  <div className="stat-trend">
                    ⚡ {stats.pendingIssues} Pending
                  </div>
                </div>
              </div>

              <div className="stat-card stat-danger">
                <div className="stat-icon">⏰</div>
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
                <Link to="/analytics" className="action-card">
                  <span className="action-icon">📊</span>
                  <h3 className="action-title">Analytics</h3>
                  <p className="action-description">View insights</p>
                </Link>

                <Link to="/manage-books" className="action-card">
                  <span className="action-icon">📚</span>
                  <h3 className="action-title">Manage Books</h3>
                  <p className="action-description">Add or edit books</p>
                </Link>

                <Link to="/manage-users" className="action-card">
                  <span className="action-icon">👥</span>
                  <h3 className="action-title">Manage Users</h3>
                  <p className="action-description">Approve members</p>
                </Link>

                <Link to="/manage-reservations" className="action-card">
                  <span className="action-icon">📋</span>
                  <h3 className="action-title">Reservations</h3>
                  <p className="action-description">Approve requests</p>
                </Link>

                <Link to="/books" className="action-card">
                  <span className="action-icon">🔍</span>
                  <h3 className="action-title">Browse Books</h3>
                  <p className="action-description">View catalog</p>
                </Link>

                <Link to="/manage-issues" className="action-card">
                  <span className="action-icon">📖</span>
                  <h3 className="action-title">Manage Issues</h3>
                  <p className="action-description">Track borrowing</p>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Student/Faculty Dashboard */}
        {(isStudent || isFaculty) && (
          <>
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {
                      recentIssues.filter((i) =>
                        ["issued", "overdue"].includes(i.status),
                      ).length
                    }
                  </div>
                  <div className="stat-label">Books Issued</div>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {recentIssues.filter((i) => i.status === "returned").length}
                  </div>
                  <div className="stat-label">Books Returned</div>
                </div>
              </div>

              <div className="stat-card stat-info">
                <div className="stat-icon">🎯</div>
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
                  <p className="action-description">Search collection</p>
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
              </div>
            </div>

            {/* Recent Activity */}
            {recentIssues.length > 0 && (
              <div className="recent-activity">
                <h2 className="section-title">📋 Recent Activity</h2>
                <div className="activity-list">
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
                      <span
                        className={`badge ${getStatusBadgeClass(issue.status)}`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
