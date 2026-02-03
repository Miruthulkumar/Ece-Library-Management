import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./MyReservations.css";

const MyBooks = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get("/issues/my");
      setIssues(response.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch issued books");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge status-pending";
      case "issued":
        return "status-badge status-available";
      case "overdue":
        return "status-badge status-cancelled";
      case "returned":
        return "status-badge status-fulfilled";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeIssues = issues.filter((issue) => 
    issue.status === "issued" || issue.status === "overdue" || issue.status === "pending"
  );

  const historyIssues = issues.filter((issue) => 
    issue.status === "returned"
  );

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="my-reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>My Books</h1>
          <p>View all your currently issued books and their due dates</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Active Issues */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
            📚 Currently Borrowed ({activeIssues.length})
          </h2>
          {activeIssues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No Borrowed Books</h3>
              <p>You don't have any books currently issued. Browse the library to borrow books!</p>
              <a href="/books" className="btn btn-primary">
                Browse Books
              </a>
            </div>
          ) : (
            <div className="reservations-grid">
              {activeIssues.map((issue) => {
                const daysRemaining = getDaysRemaining(issue.dueDate);
                const isOverdue = daysRemaining < 0;
                const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0;

                return (
                  <div key={issue._id} className="reservation-card">
                    <div className="reservation-image">
                      {issue.book?.coverImage ? (
                        <img
                          src={issue.book.coverImage}
                          alt={issue.book.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
                          }}
                        />
                      ) : (
                        <div className="placeholder-cover">
                          <span>📖</span>
                        </div>
                      )}
                    </div>

                    <div className="reservation-content">
                      <div className="reservation-header">
                        <h3 className="reservation-title">
                          {issue.book?.title || "Unknown Title"}
                        </h3>
                        <span className={getStatusBadgeClass(issue.status)}>
                          {issue.status}
                        </span>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-item">
                          <span className="detail-label">Authors:</span>
                          <span className="detail-value">
                            {issue.book?.authors?.join(", ") || "Unknown"}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">ISBN:</span>
                          <span className="detail-value">
                            {issue.book?.isbn || "N/A"}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Issued On:</span>
                          <span className="detail-value">
                            {formatDate(issue.issueDate)}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value" style={{ 
                            color: isOverdue ? "#ef4444" : isDueSoon ? "#f59e0b" : "inherit",
                            fontWeight: (isOverdue || isDueSoon) ? "600" : "normal"
                          }}>
                            {formatDate(issue.dueDate)}
                          </span>
                        </div>

                        {issue.book?.shelfLocation && (
                          <div className="detail-item">
                            <span className="detail-label">Shelf Location:</span>
                            <span className="detail-value">
                              {issue.book.shelfLocation}
                            </span>
                          </div>
                        )}
                      </div>

                      {isOverdue && (
                        <div className="reservation-alert alert-error">
                          <span className="alert-icon">⚠️</span>
                          Overdue by {Math.abs(daysRemaining)} day(s)! Please return immediately to avoid fines.
                        </div>
                      )}

                      {isDueSoon && !isOverdue && (
                        <div className="reservation-alert alert-info" style={{ backgroundColor: "#fef3c7", borderColor: "#f59e0b" }}>
                          <span className="alert-icon">⏰</span>
                          Due in {daysRemaining} day(s). Please return soon!
                        </div>
                      )}

                      {issue.status === "pending" && (
                        <div className="reservation-alert alert-info">
                          <span className="alert-icon">ℹ️</span>
                          Waiting for librarian approval to collect the book.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        {historyIssues.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
              📜 Reading History ({historyIssues.length})
            </h2>
            <div className="reservations-grid">
              {historyIssues.map((issue) => (
                <div key={issue._id} className="reservation-card" style={{ opacity: 0.8 }}>
                  <div className="reservation-image">
                    {issue.book?.coverImage ? (
                      <img
                        src={issue.book.coverImage}
                        alt={issue.book.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
                        }}
                      />
                    ) : (
                      <div className="placeholder-cover">
                        <span>📖</span>
                      </div>
                    )}
                  </div>

                  <div className="reservation-content">
                    <div className="reservation-header">
                      <h3 className="reservation-title">
                        {issue.book?.title || "Unknown Title"}
                      </h3>
                      <span className={getStatusBadgeClass(issue.status)}>
                        {issue.status}
                      </span>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-item">
                        <span className="detail-label">Authors:</span>
                        <span className="detail-value">
                          {issue.book?.authors?.join(", ") || "Unknown"}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Issued On:</span>
                        <span className="detail-value">
                          {formatDate(issue.issueDate)}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Returned On:</span>
                        <span className="detail-value">
                          {formatDate(issue.returnDate)}
                        </span>
                      </div>

                      {issue.fine && (
                        <div className="detail-item">
                          <span className="detail-label">Fine:</span>
                          <span className="detail-value" style={{ color: "#ef4444", fontWeight: "600" }}>
                            ₹{issue.fine.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
