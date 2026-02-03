import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./ManageReservations.css";

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get("/issues");
      setIssues(response.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveIssue = async (issueId) => {
    if (!window.confirm("Approve this issue and hand over the book to the user?")) {
      return;
    }

    try {
      setProcessingId(issueId);
      await api.put(`/issues/${issueId}/approve`);
      
      setSuccess("Issue approved and book issued successfully!");
      setTimeout(() => setSuccess(""), 5000);
      
      await fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve issue");
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectIssue = async (issueId) => {
    const remarks = prompt("Enter reason for rejection (optional):");
    if (remarks === null) return; // User cancelled

    try {
      setProcessingId(issueId);
      await api.put(`/issues/${issueId}/reject`, { remarks });
      
      setSuccess("Issue request rejected!");
      setTimeout(() => setSuccess(""), 5000);
      
      await fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject issue");
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReturnBook = async (issueId) => {
    if (!window.confirm("Confirm that the user has returned this book?")) {
      return;
    }

    try {
      setProcessingId(issueId);
      const response = await api.put(`/issues/${issueId}/return`);
      
      setSuccess(response.data.message || "Book returned successfully!");
      setTimeout(() => setSuccess(""), 5000);
      
      await fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process return");
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingId(null);
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
      case "return_requested":
        return "status-badge status-pending";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredIssues = issues.filter((issue) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return ["pending", "issued", "overdue", "return_requested"].includes(issue.status);
    return issue.status === filterStatus;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    issued: issues.filter((i) => i.status === "issued").length,
    returnRequested: issues.filter((i) => i.status === "return_requested").length,
    overdue: issues.filter((i) => i.status === "overdue").length,
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="manage-reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 Manage Book Issues & Returns</h1>
          <p>Approve issue requests, process book returns, and track all issued books</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card available">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.issued}</div>
              <div className="stat-label">Currently Issued</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.returnRequested}</div>
              <div className="stat-label">Return Requests</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: "#ef4444" }}>
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.overdue}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({stats.total})
          </button>
          <button
            className={`filter-tab ${filterStatus === "active" ? "active" : ""}`}
            onClick={() => setFilterStatus("active")}
          >
            Active ({stats.pending + stats.issued + stats.returnRequested + stats.overdue})
          </button>
          <button
            className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`filter-tab ${filterStatus === "return_requested" ? "active" : ""}`}
            onClick={() => setFilterStatus("return_requested")}
          >
            Return Requests ({stats.returnRequested})
          </button>
          <button
            className={`filter-tab ${filterStatus === "issued" ? "active" : ""}`}
            onClick={() => setFilterStatus("issued")}
          >
            Issued ({stats.issued})
          </button>
          <button
            className={`filter-tab ${filterStatus === "overdue" ? "active" : ""}`}
            onClick={() => setFilterStatus("overdue")}
          >
            Overdue ({stats.overdue})
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {/* Issues Table */}
        {filteredIssues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No Issues</h2>
            <p>No {filterStatus !== "all" ? filterStatus : ""} issues found.</p>
          </div>
        ) : (
          <div className="reservations-table-container">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book Details</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const daysRemaining = issue.dueDate ? getDaysRemaining(issue.dueDate) : null;
                  const isOverdue = daysRemaining !== null && daysRemaining < 0;

                  return (
                    <tr key={issue._id} style={isOverdue ? { backgroundColor: "#fee2e2" } : {}}>
                      <td>
                        <div className="user-info">
                          <div className="user-name">{issue.user?.name || "N/A"}</div>
                          <div className="user-meta">
                            {issue.user?.departmentId} • {issue.user?.role}
                          </div>
                          <div className="user-email">{issue.user?.email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="book-info">
                          <div className="book-title">{issue.book?.title || "N/A"}</div>
                          <div className="book-meta">
                            {issue.book?.authors?.join(", ") || "Unknown Author"}
                          </div>
                          <div className="book-isbn">ISBN: {issue.book?.isbn || "N/A"}</div>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">{formatDate(issue.issueDate)}</div>
                      </td>
                      <td>
                        <div className="date-info" style={isOverdue ? { color: "#ef4444", fontWeight: "600" } : {}}>
                          {formatDate(issue.dueDate)}
                          {daysRemaining !== null && (
                            <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                              {isOverdue ? (
                                <span style={{ color: "#ef4444" }}>Overdue by {Math.abs(daysRemaining)} day(s)</span>
                              ) : (
                                <span>{daysRemaining} day(s) left</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(issue.status)}>
                          {issue.status === "return_requested" ? "Return Requested" : issue.status}
                        </span>
                        {issue.status === "return_requested" && issue.returnRequestedAt && (
                          <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "#666" }}>
                            Requested: {formatDate(issue.returnRequestedAt)}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {issue.status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApproveIssue(issue._id)}
                                disabled={processingId === issue._id}
                              >
                                {processingId === issue._id ? "Processing..." : "Approve"}
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRejectIssue(issue._id)}
                                disabled={processingId === issue._id}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {(issue.status === "issued" || issue.status === "overdue" || issue.status === "return_requested") && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleReturnBook(issue._id)}
                              disabled={processingId === issue._id}
                            >
                              {processingId === issue._id ? "Processing..." : "Process Return"}
                            </button>
                          )}
                          {issue.status === "returned" && (
                            <span className="status-text">
                              Returned on {formatDate(issue.returnDate)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageIssues;
