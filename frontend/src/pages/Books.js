import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reservingBookId, setReservingBookId] = useState(null);

  const categories = [
    "all",
    "Analog Electronics",
    "Digital Electronics",
    "Communication Systems",
    "Signals and Systems",
    "VLSI Design",
    "Embedded Systems",
    "Microprocessors & Microcontrollers",
    "Antennas & RF Engineering",
    "Control Systems",
    "Internet of Things",
    "JLPT N5",
    "JLPT N4",
    "JLPT N3",
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBooks(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleReserveBook = async (bookId) => {
    try {
      setReservingBookId(bookId);
      setError("");
      setSuccess("");

      await api.post("/reservations", { bookId: bookId });

      setSuccess("Book reserved successfully! Check your reservations page.");
      setTimeout(() => setSuccess(""), 5000);

      // Refresh books to update available copies
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reserve book");
      setTimeout(() => setError(""), 5000);
    } finally {
      setReservingBookId(null);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loader fullPage />;

  return (
    <div className="books-page">
      <div className="container">
        <div className="books-header">
          <h1 className="page-title">📚 Library Catalog</h1>
          <p className="page-subtitle">Browse and search our book collection</p>
        </div>

        {/* Search and Filter Section */}
        <div className="books-filters card">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                {book.coverImage && (
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
                <div className="book-header">
                  <div className="book-icon">📖</div>
                  <div
                    className={`book-status ${
                      book.availableCopies > 0 ? "available" : "unavailable"
                    }`}
                  >
                    {book.availableCopies > 0 ? "Available" : "Unavailable"}
                  </div>
                </div>

                <h3 className="book-title">{book.title}</h3>
                <p className="book-authors">By {book.authors.join(", ")}</p>

                <div className="book-details">
                  <div className="book-detail-item">
                    <span className="detail-label">Publisher:</span>
                    <span className="detail-value">{book.publisher}</span>
                  </div>
                  <div className="book-detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">
                      {book.yearOfPublication}
                    </span>
                  </div>
                  <div className="book-detail-item">
                    <span className="detail-label">ISBN:</span>
                    <span className="detail-value">{book.isbn}</span>
                  </div>
                  <div className="book-detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value category-badge">
                      {book.category}
                    </span>
                  </div>
                  <div className="book-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{book.shelfLocation}</span>
                  </div>
                </div>

                <div className="book-copies">
                  <span className="copies-available">
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                  <span className="copies-label">copies available</span>
                </div>

                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}

                {book.availableCopies > 0 && (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleReserveBook(book._id)}
                    disabled={reservingBookId === book._id}
                  >
                    {reservingBookId === book._id
                      ? "Reserving..."
                      : "Reserve Book"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No Books Found</h3>
            <p className="empty-state-description">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "No books available in the library"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
