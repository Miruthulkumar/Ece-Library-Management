# 🚀 Setup and Installation Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- A code editor (VS Code recommended)

## Step 1: Clone or Download the Project

```bash
# If you have Git installed
git clone <repository-url>
cd library-management-system

# Or simply extract the ZIP file to your desired location
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages:

- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator
- nodemailer

### 2.3 Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and configure the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ece-library
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development

# Fine Configuration
FINE_PER_DAY=5
STUDENT_ISSUE_LIMIT=3
FACULTY_ISSUE_LIMIT=5
STUDENT_ISSUE_DAYS=14
FACULTY_ISSUE_DAYS=30
```

**Important:** Change the `JWT_SECRET` to a strong random string in production!

### 2.4 Start MongoDB

**On macOS:**

```bash
brew services start mongodb-community
```

**On Windows:**

- MongoDB should start automatically as a service
- Or run: `mongod` in a separate terminal

**On Linux:**

```bash
sudo systemctl start mongod
```

### 2.5 Create Initial Admin User (Optional)

Open MongoDB shell:

```bash
mongosh
```

Run these commands:

```javascript
use ece-library

db.users.insertOne({
  name: "Admin User",
  email: "admin@ece.edu",
  password: "$2a$10$XQ3KhZ7Y.V0xK8GFxQKVS.rqL9q3ZJxXqZgLN0VxH8Y3PK0DZqP5K",
  role: "librarian",
  departmentId: "ADMIN001",
  phone: "+91 1234567890",
  isActive: true,
  totalFineAmount: 0,
  booksIssued: [],
  reservations: [],
  fines: [],
  createdAt: new Date()
})
```

Password for this admin is: `admin123`

### 2.6 Start Backend Server

```bash
npm run dev
```

You should see:

```
✅ MongoDB Connected: localhost
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   📚 ECE Library Management System API               ║
║                                                       ║
║   🚀 Server running on port 5000                      ║
║   🌍 Environment: development                         ║
║   📡 API Base URL: http://localhost:5000              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## Step 3: Frontend Setup

Open a **new terminal window** (keep the backend running).

### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install:

- react
- react-dom
- react-router-dom
- axios
- react-scripts

### 3.3 Start Frontend Development Server

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Step 4: Verify Installation

### 4.1 Check Backend

Open your browser and go to:

```
http://localhost:5000
```

You should see a JSON response with API endpoints.

### 4.2 Check Frontend

The React app should be running at:

```
http://localhost:3000
```

You should see the login page.

## Step 5: Initial Login

### Option 1: Use Pre-created Admin (if you created one in Step 2.5)

```
Email: admin@ece.edu
Password: admin123
```

### Option 2: Register a New Account

1. Click "Register here" on the login page
2. Fill in the registration form
3. Choose role (Student/Faculty)
4. Submit the form

## Testing the Application

### Test as Student

1. Register with role "Student"
2. Provide year (1-4) and section (A/B/C)
3. After login:
   - Browse books
   - Request book issues
   - View reservations

### Test as Faculty

1. Register with role "Faculty"
2. After login:
   - Browse books with extended privileges
   - Higher issue limits (5 books vs 3)
   - Longer duration (30 days vs 14)

### Test as Librarian

1. Use admin credentials or register with role "Librarian" (needs to be manually updated in database)
2. After login:
   - Manage books (Add/Edit/Delete)
   - Approve/Reject issue requests
   - Manage users
   - View analytics

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**

- Ensure MongoDB is running: `brew services list` (macOS) or check Windows services
- Check MongoDB URI in `.env` file
- Try connecting with MongoDB Compass to verify

### Issue 2: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env file
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue 4: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**

- Ensure backend is running on port 5000
- Check `proxy` in frontend/package.json
- Verify CORS is enabled in backend/server.js

## Development Tips

### Running Both Servers Simultaneously

You can use two terminal windows:

- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm start`

Or use a tool like `concurrently` (for future enhancement).

### Accessing MongoDB

**Using MongoDB Compass:**

- Connection String: `mongodb://localhost:27017`
- Database Name: `ece-library`

**Using mongosh:**

```bash
mongosh
use ece-library
db.users.find()
db.books.find()
```

### Stopping the Servers

Press `Ctrl + C` in the terminal running the server.

## Next Steps

1. ✅ Setup completed
2. 📚 Add sample books through the librarian interface
3. 👥 Create test users (students and faculty)
4. 🔄 Test the complete workflow:
   - Book issue request
   - Approval by librarian
   - Return process
   - Fine calculation

## Production Deployment (Future)

For production deployment, you'll need to:

1. **Build Frontend:**

```bash
cd frontend
npm run build
```

2. **Set Environment Variables:**

- Use production MongoDB URI (MongoDB Atlas)
- Generate strong JWT secret
- Set NODE_ENV=production

3. **Deploy Backend:**

- Use services like Heroku, DigitalOcean, or AWS
- Configure environment variables
- Set up MongoDB Atlas

4. **Deploy Frontend:**

- Use Netlify, Vercel, or serve from backend

## Support

If you encounter any issues:

1. Check this guide first
2. Review error messages carefully
3. Check console logs in browser (F12)
4. Check terminal output for backend errors

---

**Congratulations! Your ECE Library Management System is now running! 🎉**
