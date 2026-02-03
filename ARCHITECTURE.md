# 🏗️ System Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Considerations](#security-considerations)
9. [Scalability](#scalability)

---

## Overview

The ECE Library Management System is a full-stack web application designed specifically for the Electronics and Communication Engineering department. It digitizes the library management process, replacing manual registers with an efficient, secure, and scalable solution.

### Key Objectives

- Streamline book issue and return processes
- Implement role-based access control
- Track book availability in real-time
- Generate analytics for library usage
- Support specialized categories (ECE + JLPT)
- Automate fine calculations
- Enable book reservations

---

## Technology Stack

### Backend

| Technology | Version | Purpose             |
| ---------- | ------- | ------------------- |
| Node.js    | v14+    | Runtime environment |
| Express.js | v4.18+  | Web framework       |
| MongoDB    | v4.4+   | NoSQL database      |
| Mongoose   | v7.5+   | ODM for MongoDB     |
| JWT        | v9.0+   | Authentication      |
| bcrypt.js  | v2.4+   | Password hashing    |

### Frontend

| Technology   | Version | Purpose             |
| ------------ | ------- | ------------------- |
| React.js     | v18.2+  | UI library          |
| React Router | v6.15+  | Client-side routing |
| Axios        | v1.5+   | HTTP client         |
| CSS3         | -       | Styling             |

### Development Tools

- nodemon - Auto-restart server
- MongoDB Compass - Database GUI
- Postman - API testing

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Browser                     │
│              (React SPA - Port 3000)                 │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │ REST API Calls
                     │
┌────────────────────▼────────────────────────────────┐
│              Express.js Server                       │
│              (Node.js - Port 5000)                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Middleware Layer                      │  │
│  │  - CORS                                       │  │
│  │  - Body Parser                                │  │
│  │  - JWT Authentication                         │  │
│  │  - Role Authorization                         │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Route Handlers                        │  │
│  │  - /api/auth                                  │  │
│  │  - /api/books                                 │  │
│  │  - /api/issues                                │  │
│  │  - /api/reservations                          │  │
│  │  - /api/users                                 │  │
│  │  - /api/analytics                             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Business Logic Layer                  │  │
│  │  - Controllers                                │  │
│  │  - Validation                                 │  │
│  │  - Error Handling                             │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────┐
│              MongoDB Database                        │
│                                                      │
│  Collections:                                        │
│  - users                                             │
│  - books                                             │
│  - issues                                            │
│  - reservations                                      │
│  - fines                                             │
└─────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Action** → User interacts with React UI
2. **API Call** → Axios sends HTTP request to Express server
3. **Authentication** → JWT token verified
4. **Authorization** → User role checked
5. **Validation** → Request data validated
6. **Business Logic** → Controller processes request
7. **Database** → Mongoose queries MongoDB
8. **Response** → Data returned to frontend
9. **UI Update** → React component re-renders

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ _id         │◄────────┐
│ name        │         │
│ email       │         │
│ password    │         │
│ role        │         │
│ department  │         │
│ isActive    │         │
└─────────────┘         │
       │                │
       │ 1              │
       │                │
       │ N              │ User
       │                │
┌──────▼──────┐         │
│   Issue     │         │
├─────────────┤         │
│ _id         │         │
│ user        ├─────────┘
│ book        ├─────────┐
│ issueDate   │         │
│ dueDate     │         │
│ returnDate  │         │
│ status      │         │
│ fine        │         │
└─────────────┘         │
                        │
                        │ Book
                        │
                 ┌──────▼──────┐
                 │    Book     │
                 ├─────────────┤
                 │ _id         │
                 │ title       │
                 │ authors     │
                 │ publisher   │
                 │ isbn        │
                 │ category    │
                 │ totalCopies │
                 │ available   │
                 └─────────────┘
```

### Collections Schema

#### 1. Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: student, faculty, librarian),
  departmentId: String (unique),
  phone: String,
  year: Number (for students),
  section: String (for students),
  isActive: Boolean,
  booksIssued: [ObjectId],
  reservations: [ObjectId],
  fines: [ObjectId],
  totalFineAmount: Number,
  createdAt: Date
}
```

**Indexes:**

- email (unique)
- departmentId (unique)
- role

#### 2. Books Collection

```javascript
{
  _id: ObjectId,
  title: String,
  authors: [String],
  publisher: String,
  yearOfPublication: Number,
  edition: String,
  isbn: String (unique),
  category: String,
  subCategory: String,
  totalCopies: Number,
  availableCopies: Number,
  shelfLocation: String,
  description: String,
  coverImage: String,
  tags: [String],
  issueCount: Number,
  isActive: Boolean,
  addedBy: ObjectId (ref: User),
  addedAt: Date,
  lastUpdated: Date
}
```

**Indexes:**

- isbn (unique)
- category
- title (text search)
- authors (text search)

#### 3. Issues Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: String (enum: pending, issued, returned, overdue),
  remarks: String,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  fine: ObjectId (ref: Fine)
}
```

**Indexes:**

- user
- book
- status
- dueDate

#### 4. Reservations Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  reservationDate: Date,
  status: String (enum: pending, available, fulfilled, cancelled, expired),
  queuePosition: Number,
  notifiedAt: Date,
  expiresAt: Date,
  fulfilledAt: Date,
  remarks: String
}
```

**Indexes:**

- user
- book
- status
- queuePosition

#### 5. Fines Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  issue: ObjectId (ref: Issue),
  amount: Number,
  status: String (enum: pending, paid, waived),
  createdAt: Date,
  paidAt: Date,
  paymentMethod: String,
  remarks: String,
  processedBy: ObjectId (ref: User)
}
```

**Indexes:**

- user
- status

---

## API Architecture

### RESTful API Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint        | Access  | Description         |
| ------ | --------------- | ------- | ------------------- |
| POST   | /register       | Public  | Register new user   |
| POST   | /login          | Public  | User login          |
| GET    | /me             | Private | Get current user    |
| PUT    | /updatepassword | Private | Update password     |
| PUT    | /updatedetails  | Private | Update user details |

#### Book Routes (`/api/books`)

| Method | Endpoint    | Access    | Description                  |
| ------ | ----------- | --------- | ---------------------------- |
| GET    | /           | Private   | Get all books (with filters) |
| GET    | /:id        | Private   | Get single book              |
| POST   | /           | Librarian | Create new book              |
| PUT    | /:id        | Librarian | Update book                  |
| DELETE | /:id        | Librarian | Delete book (soft)           |
| GET    | /categories | Private   | Get all categories           |

#### Issue Routes (`/api/issues`)

| Method | Endpoint     | Access    | Description           |
| ------ | ------------ | --------- | --------------------- |
| POST   | /            | Private   | Request book issue    |
| GET    | /            | Librarian | Get all issues        |
| GET    | /my          | Private   | Get user's issues     |
| GET    | /overdue     | Librarian | Get overdue books     |
| PUT    | /:id/approve | Librarian | Approve issue request |
| PUT    | /:id/reject  | Librarian | Reject issue request  |
| PUT    | /:id/return  | Librarian | Process book return   |

#### Reservation Routes (`/api/reservations`)

| Method | Endpoint     | Access            | Description             |
| ------ | ------------ | ----------------- | ----------------------- |
| POST   | /            | Private           | Create reservation      |
| GET    | /my          | Private           | Get user's reservations |
| GET    | /            | Librarian         | Get all reservations    |
| DELETE | /:id         | Private/Librarian | Cancel reservation      |
| PUT    | /:id/fulfill | Librarian         | Mark as fulfilled       |

#### User Routes (`/api/users`)

| Method | Endpoint                 | Access            | Description      |
| ------ | ------------------------ | ----------------- | ---------------- |
| GET    | /                        | Librarian         | Get all users    |
| GET    | /:id                     | Private/Librarian | Get single user  |
| PUT    | /:id                     | Librarian         | Update user      |
| DELETE | /:id                     | Librarian         | Deactivate user  |
| GET    | /:id/fines               | Private/Librarian | Get user's fines |
| PUT    | /:id/fines/:fineId/pay   | Librarian         | Pay fine         |
| PUT    | /:id/fines/:fineId/waive | Librarian         | Waive fine       |

#### Analytics Routes (`/api/analytics`)

| Method | Endpoint               | Access    | Description            |
| ------ | ---------------------- | --------- | ---------------------- |
| GET    | /dashboard             | Librarian | Get dashboard stats    |
| GET    | /popular-books         | Librarian | Most borrowed books    |
| GET    | /least-used-books      | Librarian | Least used books       |
| GET    | /category-distribution | Librarian | Category-wise stats    |
| GET    | /jlpt-demand           | Librarian | JLPT books demand      |
| GET    | /active-users          | Librarian | Most active users      |
| GET    | /issue-trends          | Librarian | Issue trends over time |
| GET    | /peak-usage            | Librarian | Peak usage periods     |
| GET    | /fines                 | Librarian | Fine statistics        |

---

## Authentication & Authorization

### JWT-Based Authentication

#### Token Generation

```javascript
// When user logs in successfully
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
```

#### Token Verification

```javascript
// Middleware to protect routes
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};
```

### Role-Based Access Control (RBAC)

#### Role Hierarchy

```
Librarian (Admin)
    │
    ├── Full system access
    ├── Manage books
    ├── Manage users
    ├── Approve/Reject requests
    └── View analytics

Faculty
    │
    ├── Browse books
    ├── Issue books (limit: 5, duration: 30 days)
    ├── Reserve books
    └── View own profile

Student
    │
    ├── Browse books
    ├── Issue books (limit: 3, duration: 14 days)
    ├── Reserve books
    └── View own profile
```

#### Authorization Middleware

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
    next();
  };
};
```

---

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.js          # Navigation bar
│   │   ├── Footer.js          # Footer component
│   │   └── Loader.js          # Loading spinner
│   ├── student/               # Student-specific components
│   ├── faculty/               # Faculty-specific components
│   └── admin/                 # Librarian components
├── pages/
│   ├── Login.js               # Login page
│   ├── Register.js            # Registration page
│   └── Home.js                # Dashboard
├── context/
│   └── AuthContext.js         # Authentication state
├── services/
│   └── api.js                 # Axios instance
└── utils/
    └── helpers.js             # Utility functions
```

### State Management

- **Context API** for global state (Authentication)
- **Component State** for local UI state
- **No Redux** - keeping it simple and suitable for academic project

### Routing

Protected routes require authentication:

```javascript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

---

## Security Considerations

### 1. Password Security

- Passwords hashed using bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

### 2. JWT Security

- Tokens expire after 7 days
- Stored in localStorage (can be upgraded to HTTP-only cookies)
- Verified on every protected route

### 3. Input Validation

- Server-side validation using express-validator
- Client-side validation for better UX
- Sanitization to prevent XSS attacks

### 4. MongoDB Injection Prevention

- Mongoose automatically escapes queries
- Input validation before database operations

### 5. CORS Configuration

- Configured to allow only frontend origin
- Credentials enabled for cross-origin requests

### 6. Error Handling

- Generic error messages to prevent information leakage
- Detailed logs only in development mode

---

## Scalability

### Current Design Supports

- **Horizontal Scaling**: Stateless API allows multiple server instances
- **Database Indexing**: Key fields indexed for fast queries
- **Pagination**: API supports pagination for large datasets
- **Caching**: Can add Redis for session/data caching

### Future Enhancements

1. **Load Balancing**: Use Nginx or cloud load balancers
2. **Database Replication**: MongoDB replica sets
3. **CDN**: Serve static assets via CDN
4. **Microservices**: Split into smaller services if needed
5. **Message Queue**: For async operations (email notifications)

---

## Conclusion

This architecture is designed to be:

- ✅ **Simple** - Easy for undergraduates to understand
- ✅ **Secure** - Industry-standard security practices
- ✅ **Scalable** - Can handle growth
- ✅ **Maintainable** - Clean code structure
- ✅ **Explainable** - Well-documented for academic review

Perfect for a college project while being production-ready for actual deployment in the ECE department.
