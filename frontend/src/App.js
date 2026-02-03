import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Books from "./pages/Books";
import MyReservations from "./pages/MyReservations";
import MyBooks from "./pages/MyBooks";
import ManageBooks from "./pages/ManageBooks";
import ManageUsers from "./pages/ManageUsers";
import ManageReservations from "./pages/ManageReservations";
import ManageIssues from "./pages/ManageIssues";
import Analytics from "./pages/Analytics";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage />;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Books Routes */}
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-books"
            element={
              <ProtectedRoute>
                <ManageBooks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-reservations"
            element={
              <ProtectedRoute>
                <ManageReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-issues"
            element={
              <ProtectedRoute>
                <ManageIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div
                className="container"
                style={{ padding: "3rem", textAlign: "center" }}
              >
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h1 className="empty-state-title">Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a
                    href="/"
                    className="btn btn-primary"
                    style={{ marginTop: "1rem" }}
                  >
                    Go to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
