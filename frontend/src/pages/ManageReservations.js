import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./ManageReservations.css";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reservations");
      setReservations(response.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReservation = async (reservationId) => {
    if (!window.confirm("Approve this reservation and issue the book to the user?")) {
      return;
    }

    try {
      setProcessingId(reservationId);
      await api.put(`/reservations/${reservationId}/approve`);
      
      setSuccess("Reservation approved and book issued successfully!");
      setTimeout(() => setSuccess(""), 5000);
      
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve reservation");
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Cancel this reservation?")) {
      return;
    }

    try {
      setProcessingId(reservationId);
      await api.delete(`/reservations/${reservationId}`);
      
      setSuccess("Reservation cancelled successfully!");
      setTimeout(() => setSuccess(""), 5000);
      
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel reservation");
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge status-pending";
      case "available":
        return "status-badge status-available";
      case "fulfilled":
        return "status-badge status-fulfilled";
      case "cancelled":
        return "status-badge status-cancelled";
      case "expired":
        return "status-badge status-expired";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "all") return true;
    return reservation.status === filterStatus;
  });

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    available: reservations.filter((r) => r.status === "available").length,
    fulfilled: reservations.filter((r) => r.status === "fulfilled").length,
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="manage-reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>📋 Manage Reservations</h1>
          <p>Approve, manage, and track all book reservations</p>
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
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card available">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
          <div className="stat-card fulfilled">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.fulfilled}</div>
              <div className="stat-label">Fulfilled</div>
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
            className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`filter-tab ${filterStatus === "available" ? "active" : ""}`}
            onClick={() => setFilterStatus("available")}
          >
            Available ({stats.available})
          </button>
          <button
            className={`filter-tab ${filterStatus === "fulfilled" ? "active" : ""}`}
            onClick={() => setFilterStatus("fulfilled")}
          >
            Fulfilled ({stats.fulfilled})
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

        {/* Reservations Table */}
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No Reservations</h2>
            <p>No {filterStatus !== "all" ? filterStatus : ""} reservations found.</p>
          </div>
        ) : (
          <div className="reservations-table-container">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Queue</th>
                  <th>User</th>
                  <th>Book Details</th>
                  <th>Reserved On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      <div className="queue-position">#{reservation.queuePosition}</div>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-name">{reservation.user?.name || "N/A"}</div>
                        <div className="user-meta">
                          {reservation.user?.departmentId} • {reservation.user?.role}
                        </div>
                        <div className="user-email">{reservation.user?.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="book-info">
                        <div className="book-title">{reservation.book?.title || "N/A"}</div>
                        <div className="book-meta">
                          {reservation.book?.authors?.join(", ") || "Unknown Author"}
                        </div>
                        <div className="book-isbn">ISBN: {reservation.book?.isbn || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">{formatDate(reservation.reservationDate)}</div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(reservation.status)}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleApproveReservation(reservation._id)}
                              disabled={processingId === reservation._id}
                            >
                              {processingId === reservation._id ? "Processing..." : "Approve & Issue"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancelReservation(reservation._id)}
                              disabled={processingId === reservation._id}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status === "available" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApproveReservation(reservation._id)}
                            disabled={processingId === reservation._id}
                          >
                            {processingId === reservation._id ? "Processing..." : "Issue Book"}
                          </button>
                        )}
                        {(reservation.status === "fulfilled" || reservation.status === "cancelled") && (
                          <span className="status-text">No actions available</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReservations;
