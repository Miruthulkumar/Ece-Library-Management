import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import "./ManageBooks.css";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    publisher: "",
    yearOfPublication: "",
    edition: "",
    isbn: "",
    category: "",
    subCategory: "General",
    totalCopies: "",
    shelfLocation: "",
    description: "",
  });

  const categories = [
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

  const subCategories = ["Vocabulary", "Grammar", "Kanji", "Reading", "Listening", "General"];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBooks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authors: "",
      publisher: "",
      yearOfPublication: "",
      edition: "",
      isbn: "",
      category: "",
      subCategory: "General",
      totalCopies: "",
      shelfLocation: "",
      description: "",
    });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const bookData = {
        ...formData,
        authors: formData.authors.split(",").map((a) => a.trim()),
        yearOfPublication: parseInt(formData.yearOfPublication),
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.totalCopies),
      };

      await api.post("/books", bookData);
      setSuccess("Book added successfully!");
      resetForm();
      setShowAddModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const bookData = {
        ...formData,
        authors: formData.authors.split(",").map((a) => a.trim()),
        yearOfPublication: parseInt(formData.yearOfPublication),
        totalCopies: parseInt(formData.totalCopies),
      };

      await api.put(`/books/${editingBook._id}`, bookData);
      setSuccess("Book updated successfully!");
      resetForm();
      setShowEditModal(false);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update book");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/books/${bookId}`);
      setSuccess("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book");
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      authors: book.authors.join(", "),
      publisher: book.publisher,
      yearOfPublication: book.yearOfPublication.toString(),
      edition: book.edition,
      isbn: book.isbn,
      category: book.category,
      subCategory: book.subCategory || "General",
      totalCopies: book.totalCopies.toString(),
      shelfLocation: book.shelfLocation,
      description: book.description || "",
    });
    setShowEditModal(true);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="manage-books-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">⚙️ Manage Books</h1>
            <p className="page-subtitle">Add, edit, or remove books from the library</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add New Book
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅</span> {success}
          </div>
        )}

        <div className="books-table-container">
          {books.length > 0 ? (
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div className="book-title-cell">
                        <strong>{book.title}</strong>
                        <small>{book.publisher}</small>
                      </div>
                    </td>
                    <td>{book.authors.join(", ")}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <span className="category-badge">{book.category}</span>
                    </td>
                    <td>
                      <div className="copies-cell">
                        <span className="available">{book.availableCopies}</span>
                        <span className="separator">/</span>
                        <span className="total">{book.totalCopies}</span>
                      </div>
                    </td>
                    <td>{book.shelfLocation}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(book)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteBook(book._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No Books Yet</h3>
              <p className="empty-state-description">
                Start by adding your first book to the library
              </p>
            </div>
          )}
        </div>

        {/* Add Book Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>➕ Add New Book</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddBook} className="book-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Authors * (comma separated)</label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleChange}
                      placeholder="e.g., John Doe, Jane Smith"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Publisher *</label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Publication *</label>
                    <input
                      type="number"
                      name="yearOfPublication"
                      value={formData.yearOfPublication}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Edition</label>
                    <input
                      type="text"
                      name="edition"
                      value={formData.edition}
                      onChange={handleChange}
                      placeholder="e.g., 1st, 2nd"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub-Category</label>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                    >
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Copies *</label>
                    <input
                      type="number"
                      name="totalCopies"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Shelf Location *</label>
                    <input
                      type="text"
                      name="shelfLocation"
                      value={formData.shelfLocation}
                      onChange={handleChange}
                      placeholder="e.g., A-101"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of the book"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Edit Book</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditBook} className="book-form">
                {/* Same form fields as Add Book */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Authors * (comma separated)</label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Publisher *</label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Publication *</label>
                    <input
                      type="number"
                      name="yearOfPublication"
                      value={formData.yearOfPublication}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Edition</label>
                    <input
                      type="text"
                      name="edition"
                      value={formData.edition}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub-Category</label>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                    >
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Copies *</label>
                    <input
                      type="number"
                      name="totalCopies"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Shelf Location *</label>
                    <input
                      type="text"
                      name="shelfLocation"
                      value={formData.shelfLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
