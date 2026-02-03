# 📡 API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User

Register a new student or faculty member.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@ece.edu",
  "password": "securepass123",
  "departmentId": "ECE2023001",
  "phone": "+91 9876543210",
  "role": "student",
  "year": 2,
  "section": "A"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john.doe@ece.edu",
    "role": "student",
    "departmentId": "ECE2023001"
  }
}
```

---

### Login

Authenticate user and get JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**

```json
{
  "email": "john.doe@ece.edu",
  "password": "securepass123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john.doe@ece.edu",
    "role": "student",
    "departmentId": "ECE2023001"
  }
}
```

---

### Get Current User

Get logged-in user details.

**Endpoint:** `GET /auth/me`

**Access:** Private

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john.doe@ece.edu",
    "role": "student",
    "departmentId": "ECE2023001",
    "phone": "+91 9876543210",
    "year": 2,
    "section": "A",
    "isActive": true,
    "totalFineAmount": 0,
    "booksIssued": [...],
    "reservations": [...],
    "fines": []
  }
}
```

---

## 📚 Book Endpoints

### Get All Books

Retrieve all books with filtering and pagination.

**Endpoint:** `GET /books`

**Access:** Private

**Query Parameters:**

- `search` (string) - Search in title, author, ISBN
- `category` (string) - Filter by category
- `subCategory` (string) - Filter by subcategory
- `author` (string) - Filter by author
- `publisher` (string) - Filter by publisher
- `yearFrom` (number) - Min publication year
- `yearTo` (number) - Max publication year
- `availability` (string) - 'available' or 'unavailable'
- `sortBy` (string) - 'title', 'year', 'popular', 'recent'
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

**Example:**

```
GET /books?search=electronics&category=Digital Electronics&sortBy=popular&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "pages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "64f5...",
      "title": "Digital Electronics Fundamentals",
      "authors": ["Floyd, Thomas L."],
      "publisher": "Pearson",
      "yearOfPublication": 2015,
      "edition": "11th",
      "isbn": "978-0132737968",
      "category": "Digital Electronics",
      "subCategory": "General",
      "totalCopies": 5,
      "availableCopies": 3,
      "shelfLocation": "A-12-3",
      "issueCount": 42,
      "isActive": true
    }
  ]
}
```

---

### Get Single Book

Get detailed information about a specific book.

**Endpoint:** `GET /books/:id`

**Access:** Private

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f5...",
    "title": "Digital Electronics Fundamentals",
    "authors": ["Floyd, Thomas L."],
    "publisher": "Pearson",
    "yearOfPublication": 2015,
    "edition": "11th",
    "isbn": "978-0132737968",
    "category": "Digital Electronics",
    "subCategory": "General",
    "totalCopies": 5,
    "availableCopies": 3,
    "shelfLocation": "A-12-3",
    "description": "Comprehensive guide to digital electronics...",
    "tags": ["logic gates", "flip-flops", "counters"],
    "issueCount": 42,
    "isActive": true,
    "addedBy": {
      "name": "Librarian",
      "email": "admin@ece.edu"
    },
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Create Book

Add a new book to the library (Librarian only).

**Endpoint:** `POST /books`

**Access:** Librarian

**Request Body:**

```json
{
  "title": "Communication Systems",
  "authors": ["Simon Haykin"],
  "publisher": "Wiley",
  "yearOfPublication": 2013,
  "edition": "5th",
  "isbn": "978-0471697909",
  "category": "Communication Systems",
  "subCategory": "General",
  "totalCopies": 3,
  "shelfLocation": "B-08-2",
  "description": "Comprehensive coverage of analog and digital communication systems",
  "tags": ["modulation", "demodulation", "signals"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f6...",
    "title": "Communication Systems",
    ...
  }
}
```

---

### Update Book

Update book information (Librarian only).

**Endpoint:** `PUT /books/:id`

**Access:** Librarian

**Request Body:**

```json
{
  "totalCopies": 5,
  "shelfLocation": "B-08-3"
}
```

---

### Delete Book

Soft delete a book (Librarian only).

**Endpoint:** `DELETE /books/:id`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

## 📖 Issue Endpoints

### Request Book Issue

Student/Faculty requests to issue a book.

**Endpoint:** `POST /issues`

**Access:** Private

**Request Body:**

```json
{
  "bookId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Issue request submitted successfully. Waiting for librarian approval.",
  "data": {
    "_id": "64f7...",
    "user": "64f5...",
    "book": {
      "title": "Digital Electronics Fundamentals",
      ...
    },
    "issueDate": "2024-02-03T10:00:00Z",
    "dueDate": "2024-02-17T10:00:00Z",
    "status": "pending"
  }
}
```

---

### Get My Issues

Get logged-in user's issue history.

**Endpoint:** `GET /issues/my`

**Access:** Private

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f7...",
      "book": {
        "title": "Digital Electronics Fundamentals",
        "authors": ["Floyd, Thomas L."],
        "isbn": "978-0132737968"
      },
      "issueDate": "2024-02-03T10:00:00Z",
      "dueDate": "2024-02-17T10:00:00Z",
      "returnDate": null,
      "status": "issued",
      "fine": null
    }
  ]
}
```

---

### Approve Issue Request

Librarian approves an issue request.

**Endpoint:** `PUT /issues/:id/approve`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "message": "Book issued successfully",
  "data": {
    "_id": "64f7...",
    "status": "issued",
    "approvedBy": "64f8...",
    "approvedAt": "2024-02-03T11:00:00Z"
  }
}
```

---

### Return Book

Librarian processes book return.

**Endpoint:** `PUT /issues/:id/return`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "message": "Book returned with fine of ₹25",
  "data": {
    "_id": "64f7...",
    "returnDate": "2024-02-20T14:30:00Z",
    "status": "returned",
    "fine": {
      "amount": 25,
      "status": "pending"
    }
  }
}
```

---

### Get Overdue Books

Get all overdue books (Librarian only).

**Endpoint:** `GET /issues/overdue`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f7...",
      "user": {
        "name": "John Doe",
        "email": "john@ece.edu",
        "departmentId": "ECE2023001",
        "phone": "+91 9876543210"
      },
      "book": {
        "title": "Digital Electronics",
        "isbn": "978-0132737968"
      },
      "dueDate": "2024-01-30T10:00:00Z",
      "status": "overdue"
    }
  ]
}
```

---

## 🔖 Reservation Endpoints

### Create Reservation

Reserve a currently unavailable book.

**Endpoint:** `POST /reservations`

**Access:** Private

**Request Body:**

```json
{
  "bookId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Reservation created. You are at position 2 in the queue.",
  "data": {
    "_id": "64f9...",
    "user": "64f5...",
    "book": {
      "title": "Communication Systems",
      ...
    },
    "queuePosition": 2,
    "status": "pending",
    "reservationDate": "2024-02-03T10:00:00Z"
  }
}
```

---

### Get My Reservations

Get logged-in user's reservations.

**Endpoint:** `GET /reservations/my`

**Access:** Private

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f9...",
      "book": {
        "title": "Communication Systems",
        "authors": ["Simon Haykin"]
      },
      "queuePosition": 2,
      "status": "pending",
      "reservationDate": "2024-02-03T10:00:00Z"
    }
  ]
}
```

---

### Cancel Reservation

Cancel a reservation.

**Endpoint:** `DELETE /reservations/:id`

**Access:** Private (owner) or Librarian

**Response:**

```json
{
  "success": true,
  "message": "Reservation cancelled successfully"
}
```

---

## 👥 User Management Endpoints

### Get All Users

Get list of all users (Librarian only).

**Endpoint:** `GET /users`

**Access:** Librarian

**Query Parameters:**

- `role` (string) - Filter by role
- `isActive` (boolean) - Filter by active status
- `search` (string) - Search in name, email, departmentId

**Response:**

```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "64f5...",
      "name": "John Doe",
      "email": "john@ece.edu",
      "role": "student",
      "departmentId": "ECE2023001",
      "phone": "+91 9876543210",
      "year": 2,
      "section": "A",
      "isActive": true,
      "totalFineAmount": 0
    }
  ]
}
```

---

### Update User

Update user information (Librarian only).

**Endpoint:** `PUT /users/:id`

**Access:** Librarian

**Request Body:**

```json
{
  "isActive": false,
  "section": "B"
}
```

---

### Get User Fines

Get all fines for a specific user.

**Endpoint:** `GET /users/:id/fines`

**Access:** Private (owner) or Librarian

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64fa...",
      "amount": 25,
      "status": "pending",
      "issue": {
        "book": {
          "title": "Digital Electronics"
        }
      },
      "createdAt": "2024-02-20T14:30:00Z"
    }
  ]
}
```

---

### Pay Fine

Process fine payment (Librarian only).

**Endpoint:** `PUT /users/:id/fines/:fineId/pay`

**Access:** Librarian

**Request Body:**

```json
{
  "paymentMethod": "cash"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Fine paid successfully",
  "data": {
    "_id": "64fa...",
    "amount": 25,
    "status": "paid",
    "paidAt": "2024-02-21T10:00:00Z",
    "paymentMethod": "cash"
  }
}
```

---

## 📊 Analytics Endpoints

### Get Dashboard Statistics

Get overview statistics (Librarian only).

**Endpoint:** `GET /analytics/dashboard`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "data": {
    "totalBooks": 250,
    "totalUsers": 150,
    "totalIssues": 523,
    "activeIssues": 45,
    "totalAvailable": 178,
    "overdueCount": 8,
    "pendingIssues": 5,
    "pendingReservations": 12,
    "totalPendingFines": 450,
    "usersByRole": [
      { "_id": "student", "count": 120 },
      { "_id": "faculty", "count": 28 },
      { "_id": "librarian", "count": 2 }
    ]
  }
}
```

---

### Get Popular Books

Get most borrowed books.

**Endpoint:** `GET /analytics/popular-books`

**Access:** Librarian

**Query Parameters:**

- `limit` (number) - Number of results (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "title": "Digital Electronics Fundamentals",
      "authors": ["Floyd, Thomas L."],
      "category": "Digital Electronics",
      "issueCount": 42
    }
  ]
}
```

---

### Get Category Distribution

Get book distribution by category.

**Endpoint:** `GET /analytics/category-distribution`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "Digital Electronics",
      "totalBooks": 25,
      "totalCopies": 75,
      "availableCopies": 48,
      "totalIssues": 156
    }
  ]
}
```

---

### Get JLPT Demand Analysis

Get demand analysis for JLPT books.

**Endpoint:** `GET /analytics/jlpt-demand`

**Access:** Librarian

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "category": "JLPT N5",
        "subCategory": "Vocabulary"
      },
      "count": 23
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. For production:

- Consider implementing rate limiting using `express-rate-limit`
- Recommended: 100 requests per 15 minutes per IP

---

## Testing with Postman

### 1. Create Environment

```
BASE_URL: http://localhost:5000/api
TOKEN: (leave empty initially)
```

### 2. Login Sequence

1. Register or Login → Copy token from response
2. Set TOKEN in environment
3. Use `{{TOKEN}}` in Authorization header for subsequent requests

### 3. Sample Collection

Import this JSON to get started:

```json
{
  "info": { "name": "ECE Library API" },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{BASE_URL}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@ece.edu\",\n  \"password\": \"admin123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Best Practices

1. **Always include error handling** in your client code
2. **Store tokens securely** (consider HTTP-only cookies for production)
3. **Validate data** on client-side before sending
4. **Handle pagination** for large datasets
5. **Use search and filters** to reduce payload size

---

**For more detailed examples and advanced usage, refer to the frontend implementation in the React components.**
