import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./Analytics.css";

const Analytics = () => {
  const { isLibrarian } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [popularBooks, setPopularBooks] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [issueTrends, setIssueTrends] = useState([]);
  const [fineStats, setFineStats] = useState(null);

  useEffect(() => {
    if (isLibrarian) {
      loadAnalytics();
    }
  }, [isLibrarian]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all analytics data
      const [dashboard, popular, categories, users, trends, fines] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/popular-books?limit=5"),
        api.get("/analytics/category-distribution"),
        api.get("/analytics/active-users?limit=5"),
        api.get("/analytics/issue-trends?period=month"),
        api.get("/analytics/fines"),
      ]);

      setDashboardStats(dashboard.data.data);
      setPopularBooks(popular.data.data);
      setCategoryDistribution(categories.data.data);
      setActiveUsers(users.data.data);
      setIssueTrends(trends.data.data);
      setFineStats(fines.data.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLibrarian) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>⛔ Access Denied</h2>
          <p>Only librarians can access analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader fullPage />;
  }

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || monthNum;
  };

  return (
    <div className="analytics-container">
      <div className="container">
        {/* Page Header */}
        <div className="analytics-header">
          <h1 className="analytics-title">📊 Library Analytics Dashboard</h1>
          <p className="analytics-subtitle">
            Comprehensive insights and statistics for data-driven decision making
          </p>
        </div>

        {/* Overview Stats */}
        {dashboardStats && (
          <section className="analytics-section">
            <h2 className="section-title">📈 Overview Statistics</h2>
            <div className="stats-grid-large">
              <div className="stat-card-analytics stat-primary">
                <div className="stat-icon-large">📚</div>
                <div className="stat-content">
                  <div className="stat-value-large">{dashboardStats.totalBooks}</div>
                  <div className="stat-label">Total Books</div>
                  <div className="stat-detail">{dashboardStats.totalAvailable} copies available</div>
                </div>
              </div>

              <div className="stat-card-analytics stat-success">
                <div className="stat-icon-large">👥</div>
                <div className="stat-content">
                  <div className="stat-value-large">{dashboardStats.totalUsers}</div>
                  <div className="stat-label">Active Users</div>
                  <div className="stat-detail">
                    {dashboardStats.usersByRole?.find(r => r._id === 'student')?.count || 0} students, {' '}
                    {dashboardStats.usersByRole?.find(r => r._id === 'faculty')?.count || 0} faculty
                  </div>
                </div>
              </div>

              <div className="stat-card-analytics stat-info">
                <div className="stat-icon-large">📖</div>
                <div className="stat-content">
                  <div className="stat-value-large">{dashboardStats.totalIssues}</div>
                  <div className="stat-label">Total Issues</div>
                  <div className="stat-detail">{dashboardStats.activeIssues} currently active</div>
                </div>
              </div>

              <div className="stat-card-analytics stat-warning">
                <div className="stat-icon-large">⏰</div>
                <div className="stat-content">
                  <div className="stat-value-large">{dashboardStats.overdueCount}</div>
                  <div className="stat-label">Overdue Books</div>
                  <div className="stat-detail">₹{dashboardStats.totalPendingFines} pending fines</div>
                </div>
              </div>

              <div className="stat-card-analytics stat-purple">
                <div className="stat-icon-large">📋</div>
                <div className="stat-content">
                  <div className="stat-value-large">{dashboardStats.pendingReservations}</div>
                  <div className="stat-label">Pending Reservations</div>
                  <div className="stat-detail">{dashboardStats.pendingIssues} pending issues</div>
                </div>
              </div>

              <div className="stat-card-analytics stat-danger">
                <div className="stat-icon-large">💰</div>
                <div className="stat-content">
                  <div className="stat-value-large">
                    ₹{fineStats?.summary?.find(s => s._id === 'paid')?.totalAmount || 0}
                  </div>
                  <div className="stat-label">Fines Collected</div>
                  <div className="stat-detail">
                    {fineStats?.summary?.find(s => s._id === 'paid')?.count || 0} payments
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Books */}
        {popularBooks.length > 0 && (
          <section className="analytics-section">
            <h2 className="section-title">🔥 Most Popular Books</h2>
            <div className="analytics-card">
              <div className="books-list">
                {popularBooks.map((book, index) => (
                  <div key={book._id} className="book-item-analytics">
                    <div className="book-rank">#{index + 1}</div>
                    <div className="book-details">
                      <h3 className="book-title-analytics">{book.title}</h3>
                      <p className="book-meta">
                        {book.authors?.join(", ")} • {book.category}
                      </p>
                    </div>
                    <div className="book-stats">
                      <span className="issue-count">{book.issueCount} issues</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Distribution */}
        {categoryDistribution.length > 0 && (
          <section className="analytics-section">
            <h2 className="section-title">📊 Category Distribution</h2>
            <div className="analytics-card">
              <div className="category-grid">
                {categoryDistribution.map((category) => {
                  const utilizationRate = category.totalCopies > 0 
                    ? ((category.totalCopies - category.availableCopies) / category.totalCopies * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={category._id} className="category-item">
                      <div className="category-header">
                        <h3 className="category-name">{category._id}</h3>
                        <span className="category-badge">{category.totalBooks} books</span>
                      </div>
                      <div className="category-stats-grid">
                        <div className="category-stat">
                          <span className="stat-label-small">Total Copies</span>
                          <span className="stat-value-small">{category.totalCopies}</span>
                        </div>
                        <div className="category-stat">
                          <span className="stat-label-small">Available</span>
                          <span className="stat-value-small">{category.availableCopies}</span>
                        </div>
                        <div className="category-stat">
                          <span className="stat-label-small">Total Issues</span>
                          <span className="stat-value-small">{category.totalIssues}</span>
                        </div>
                        <div className="category-stat">
                          <span className="stat-label-small">Utilization</span>
                          <span className="stat-value-small">{utilizationRate}%</span>
                        </div>
                      </div>
                      <div className="utilization-bar">
                        <div 
                          className="utilization-fill" 
                          style={{ width: `${utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Active Users */}
        {activeUsers.length > 0 && (
          <section className="analytics-section">
            <h2 className="section-title">⭐ Most Active Users</h2>
            <div className="analytics-card">
              <div className="users-list">
                {activeUsers.map((user, index) => (
                  <div key={user._id} className="user-item-analytics">
                    <div className="user-rank">#{index + 1}</div>
                    <div className="user-details">
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-meta">
                        {user.email} • {user.role}
                        {user.departmentId && ` • Dept: ${user.departmentId}`}
                      </p>
                    </div>
                    <div className="user-stats">
                      <span className="user-stat-item">
                        📚 {user.issueCount} total
                      </span>
                      <span className="user-stat-item active">
                        📖 {user.activeIssues} active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Issue Trends */}
        {issueTrends.length > 0 && (
          <section className="analytics-section">
            <h2 className="section-title">📈 Issue Trends (Last 12 Months)</h2>
            <div className="analytics-card">
              <div className="trends-chart">
                {issueTrends.map((trend) => {
                  const maxIssues = Math.max(...issueTrends.map(t => t.totalIssues));
                  const height = maxIssues > 0 ? (trend.totalIssues / maxIssues * 100) : 0;
                  const monthLabel = trend._id.month 
                    ? `${getMonthName(trend._id.month)} ${trend._id.year}`
                    : trend._id.year;

                  return (
                    <div key={`${trend._id.year}-${trend._id.month || 0}`} className="trend-bar-container">
                      <div className="trend-bar-wrapper">
                        <div 
                          className="trend-bar" 
                          style={{ height: `${height}%` }}
                          title={`${trend.totalIssues} issues`}
                        >
                          <span className="trend-value">{trend.totalIssues}</span>
                        </div>
                      </div>
                      <div className="trend-details">
                        <div className="trend-month">{monthLabel}</div>
                        <div className="trend-stats-small">
                          <span className="trend-returned">✓ {trend.returned}</span>
                          <span className="trend-overdue">⚠ {trend.overdue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Fine Statistics */}
        {fineStats && (
          <section className="analytics-section">
            <h2 className="section-title">💰 Fine Statistics</h2>
            <div className="fines-grid">
              {fineStats.summary?.map((fine) => (
                <div key={fine._id} className="fine-card">
                  <div className="fine-status">{fine._id.toUpperCase()}</div>
                  <div className="fine-amount">₹{fine.totalAmount}</div>
                  <div className="fine-count">{fine.count} fines</div>
                </div>
              ))}
            </div>
            
            {fineStats.monthlyCollection && fineStats.monthlyCollection.length > 0 && (
              <div className="analytics-card" style={{ marginTop: '1.5rem' }}>
                <h3 className="subsection-title">Monthly Fine Collection</h3>
                <div className="collection-chart">
                  {fineStats.monthlyCollection.map((month) => (
                    <div key={month._id} className="collection-item">
                      <span className="collection-month">{getMonthName(month._id)}</span>
                      <div className="collection-bar-wrapper">
                        <div 
                          className="collection-bar" 
                          style={{ 
                            width: `${(month.amount / Math.max(...fineStats.monthlyCollection.map(m => m.amount))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="collection-amount">₹{month.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Analytics;
