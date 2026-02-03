const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Route files
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const issueRoutes = require("./routes/issues");
const reservationRoutes = require("./routes/reservations");
const userRoutes = require("./routes/users");
const analyticsRoutes = require("./routes/analytics");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MKCE ECE Library Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      books: "/api/books",
      issues: "/api/issues",
      reservations: "/api/reservations",
      users: "/api/users",
      analytics: "/api/analytics",
    },
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 6070;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   📚 MKCE ECE Library Management System API          ║
║                                                       ║
║   🚀 Server running on port ${PORT}                    ║
║   🌍 Environment: ${process.env.NODE_ENV || "development"}                   ║
║   📡 API Base URL: http://localhost:${PORT}            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
