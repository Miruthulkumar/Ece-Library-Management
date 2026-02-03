import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./MyReservations.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reservations/my");
      setReservations(response.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      setCancellingId(reservationId);
      await api.delete(`/reservations/${reservationId}`);
      
      // Refresh the reservations list
      await fetchMyReservations();
      
      alert("Reservation cancelled successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel reservation");
    } finally {
      setCancellingId(null);
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

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="my-reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>My Reservations</h1>
          <p>View and manage your book reservations</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h2 className="empty-state-title">No Reservations Yet</h2>
            <p>You haven't reserved any books. Browse the library to reserve books!</p>
            <a href="/books" className="btn btn-primary">
              Browse Books
            </a>
          </div>
        ) : (
          <div className="reservations-grid">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-image">
                  {reservation.book?.coverImage ? (
                    <img
                      src={reservation.book.coverImage}
                      alt={reservation.book.title}
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
                      {reservation.book?.title || "Unknown Title"}
                    </h3>
                    <span className={getStatusBadgeClass(reservation.status)}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="reservation-details">
                    <div className="detail-item">
                      <span className="detail-label">Authors:</span>
                      <span className="detail-value">
                        {reservation.book?.authors?.join(", ") || "Unknown"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">ISBN:</span>
                      <span className="detail-value">
                        {reservation.book?.isbn || "N/A"}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Reserved On:</span>
                      <span className="detail-value">
                        {formatDate(reservation.reservationDate)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Queue Position:</span>
                      <span className="detail-value queue-position">
                        #{reservation.queuePosition}
                      </span>
                    </div>

                    {reservation.expiresAt && (
                      <div className="detail-item">
                        <span className="detail-label">Expires On:</span>
                        <span className="detail-value">
                          {formatDate(reservation.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {reservation.status === "pending" && (
                    <div className="reservation-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelReservation(reservation._id)}
                        disabled={cancellingId === reservation._id}
                      >
                        {cancellingId === reservation._id ? "Cancelling..." : "Cancel Reservation"}
                      </button>
                    </div>
                  )}

                  {reservation.status === "available" && (
                    <div className="reservation-alert alert-info">
                      <span className="alert-icon">ℹ️</span>
                      This book is now available! Please collect it from the library.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
