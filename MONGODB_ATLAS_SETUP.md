# MongoDB Atlas Configuration Guide

## Overview
Your project has been configured to use MongoDB Atlas cloud database instead of localhost, allowing you to access the same database from multiple devices.

---

## ✅ What Has Been Updated

### 1. `.env.example` File Updated
The example environment file has been updated with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://miruthul:IyLBTWLHTjq9BGmc@cluster0.avtwclw.mongodb.net/ece-library?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🚀 Setup Instructions

### Step 1: Update Your Local `.env` File

1. Navigate to the `backend` directory
2. If you don't have a `.env` file, create one by copying `.env.example`:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. If you already have a `.env` file, open it and update the `MONGODB_URI` line to:
   ```
   MONGODB_URI=mongodb+srv://miruthul:IyLBTWLHTjq9BGmc@cluster0.avtwclw.mongodb.net/ece-library?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 2: Install Dependencies (if not already done)
```bash
cd backend
npm install
```

### Step 3: Restart Your Backend Server

If your server is running, stop it (Ctrl+C) and restart:
```bash
npm start
# or
npm run dev
```

You should see a message like:
```
MongoDB Connected: cluster0.avtwclw.mongodb.net
Server running on port 6070
```

---

## 📦 Database Information

- **Cluster Name:** Cluster0
- **Database Name:** ece-library
- **Region:** Auto-selected by MongoDB Atlas
- **Connection Type:** MongoDB Atlas (Cloud)

---

## 🔄 Benefits of MongoDB Atlas

### 1. **Access from Multiple Devices**
- Your database is now in the cloud
- Work from any computer with internet access
- No need to set up MongoDB locally on each device

### 2. **Automatic Backups**
- MongoDB Atlas provides automatic backups
- Point-in-time recovery available

### 3. **Always Online**
- No need to start MongoDB service locally
- Database is always available when you have internet

### 4. **Scalability**
- Easy to upgrade resources as your app grows
- Free tier supports up to 512MB storage

---

## 📋 Testing the Connection

### Test 1: Check Backend Connection
1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Look for the success message:
   ```
   MongoDB Connected: cluster0.avtwclw.mongodb.net
   ```

### Test 2: Seed the Database (First Time Setup)
If this is your first time using Atlas, seed the database:
```bash
cd backend
node seed.js
```

This will create:
- A default librarian account
- Sample books
- Sample users

### Test 3: Test API Endpoints
Open your browser or Postman and test:
```
http://localhost:6070/api/auth/login
```

---

## 🔐 Security Considerations

### ⚠️ Important Security Notes:

1. **Password in Connection String**
   - Your password is visible in the connection string
   - This is normal for MongoDB Atlas connections
   - **NEVER commit `.env` file to Git** (it's already in `.gitignore`)

2. **IP Whitelist in MongoDB Atlas**
   To allow connections from any device:
   - Go to MongoDB Atlas Dashboard
   - Navigate to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IP addresses for better security

3. **Database User Permissions**
   - Username: `miruthul`
   - Ensure this user has read/write access to the database
   - Check in MongoDB Atlas → Database Access

---

## 🌐 Accessing from Different Devices

### On a New Device:

1. **Clone your project:**
   ```bash
   git clone <your-repo-url>
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   
   cd ../frontend
   npm install
   ```

3. **Create `.env` file in backend:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   The `.env` file will already have the correct MongoDB Atlas URI!

4. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

---

## 🐛 Troubleshooting

### Issue 1: "Connection Timed Out"
**Solution:**
- Check your internet connection
- Verify IP address is whitelisted in MongoDB Atlas
- Go to Atlas → Network Access → Add IP Address → Allow from Anywhere

### Issue 2: "Authentication Failed"
**Solution:**
- Verify username and password in connection string
- Check user exists in MongoDB Atlas → Database Access
- Ensure user has proper permissions

### Issue 3: "Database Not Found"
**Solution:**
- The database `ece-library` will be created automatically
- Run `node seed.js` to populate initial data

### Issue 4: "Module Not Found"
**Solution:**
```bash
cd backend
npm install mongoose dotenv
```

---

## 📊 Monitoring Your Database

### MongoDB Atlas Dashboard:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Select your cluster (Cluster0)
4. Click "Browse Collections" to view your data

### Available Features:
- **Collections:** View all documents in your database
- **Metrics:** Monitor database performance
- **Charts:** Create visualizations of your data
- **Logs:** View connection logs and errors

---

## 🔄 Switching Back to Localhost (If Needed)

If you want to use localhost again:

1. Open `backend/.env`
2. Change MONGODB_URI to:
   ```
   MONGODB_URI=mongodb://localhost:27017/ece-library
   ```
3. Ensure MongoDB is running locally
4. Restart your backend server

---

## 📝 Environment Variables Checklist

Make sure your `backend/.env` file contains:

```env
PORT=6070
MONGODB_URI=mongodb+srv://miruthul:IyLBTWLHTjq9BGmc@cluster0.avtwclw.mongodb.net/ece-library?retryWrites=true&w=majority&appName=Cluster0
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

---

## ✅ Summary

Your project is now configured to use **MongoDB Atlas** cloud database!

**Next Steps:**
1. Update your local `backend/.env` file with the new MONGODB_URI
2. Restart your backend server
3. Verify connection in the console logs
4. Run seed script if this is your first time using Atlas
5. Test the application

**Benefits:**
- ✅ Work from any device
- ✅ Automatic backups
- ✅ Always online
- ✅ No local MongoDB setup required

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your MongoDB Atlas Network Access settings
3. Ensure your `.env` file has the correct connection string
4. Check backend console for error messages

---

**Last Updated:** February 3, 2026
**Configuration:** MongoDB Atlas Cloud Database
