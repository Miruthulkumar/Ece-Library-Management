// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Check if date is overdue
export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

// Calculate days remaining
export const getDaysRemaining = (dueDate) => {
  const diff = new Date(dueDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: "#f59e0b",
    issued: "#3b82f6",
    returned: "#10b981",
    overdue: "#ef4444",
    cancelled: "#6b7280",
    available: "#10b981",
    fulfilled: "#10b981",
    expired: "#ef4444",
  };
  return colors[status] || "#6b7280";
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const classes = {
    pending: "status-badge-warning",
    issued: "status-badge-primary",
    returned: "status-badge-success",
    overdue: "status-badge-danger",
    cancelled: "status-badge-secondary",
    available: "status-badge-success",
    fulfilled: "status-badge-success",
    expired: "status-badge-danger",
  };
  return classes[status] || "status-badge-secondary";
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Show toast notification (simple implementation)
export const showToast = (message, type = "info") => {
  // This can be replaced with a proper toast library
  alert(message);
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    "Analog Electronics": "#8b5cf6",
    "Digital Electronics": "#3b82f6",
    "Communication Systems": "#06b6d4",
    "Signals and Systems": "#10b981",
    "VLSI Design": "#f59e0b",
    "Embedded Systems": "#ef4444",
    "Microprocessors & Microcontrollers": "#ec4899",
    "Antennas & RF Engineering": "#6366f1",
    "Control Systems": "#14b8a6",
    "Internet of Things": "#84cc16",
    "JLPT N5": "#f97316",
    "JLPT N4": "#f59e0b",
    "JLPT N3": "#eab308",
  };
  return colors[category] || "#6b7280";
};

// Generate avatar initials
export const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
