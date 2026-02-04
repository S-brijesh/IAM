# 🚀 Quick Start Guide - SecureIAM System

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

---

## 📦 Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd IAM

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## ⚙️ Configuration

### 1. Server Configuration

Create/verify `.env` file in `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iam_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iam_system
```

### 2. Client Configuration

The client is already configured to connect to `http://localhost:5000`

If you need to change the API URL, edit `client/src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

---

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Server will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client will run on: `http://localhost:5173`

### Option 2: Using Nodemon (Backend Auto-reload)

```bash
cd server
npm run dev
```

---

## 👥 Creating Test Users

### Method 1: Using the Registration Page

1. Open browser: `http://localhost:5173`
2. Click "Register"
3. Fill in the form with different roles

### Method 2: Using the Test Script

```bash
cd server
node test-api.js
```

This will automatically create:
- Admin user: `testadmin@company.com` / `admin123`
- HR Manager: `testhr@company.com` / `hr123`
- Employee: `testemployee@company.com` / `user123`

### Method 3: Manual Registration via API

**Admin User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin",
    "email": "admin@company.com",
    "password": "admin123",
    "role": "IT_ADMIN",
    "department": "IT Operations"
  }'
```

**HR Manager:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "HR",
    "lastName": "Manager",
    "username": "hrmanager",
    "email": "hr@company.com",
    "password": "hr123",
    "role": "HR_MANAGER",
    "department": "Human Resources"
  }'
```

**Employee:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@company.com",
    "password": "john123",
    "role": "EMPLOYEE",
    "department": "Engineering"
  }'
```

---

## 🧪 Testing the Application

### 1. Test Backend API

```bash
cd server
node test-api.js
```

Expected output:
```
🚀 Starting API Tests...
✅ Admin registered successfully
✅ HR Manager registered successfully
✅ Employee registered successfully
✅ Admin logged in successfully
✅ HR Dashboard: { totalEmployees: 3, ... }
✨ All tests completed!
```

### 2. Test Frontend

1. **Login as Admin:**
   - Email: `testadmin@company.com`
   - Password: `admin123`
   - Access: Admin Dashboard, User Management, Audit Logs

2. **Login as HR Manager:**
   - Email: `testhr@company.com`
   - Password: `hr123`
   - Access: HR Dashboard, Announcements

3. **Login as Employee:**
   - Email: `testemployee@company.com`
   - Password: `user123`
   - Access: Personal Dashboard, View Announcements

---

## 🎯 Feature Testing Checklist

### Admin Features
- [ ] View dashboard with real statistics
- [ ] Navigate to User Management
- [ ] Search and filter users
- [ ] View user details
- [ ] Deactivate a user
- [ ] View Audit Logs
- [ ] Filter audit logs by action
- [ ] Check system statistics

### HR Manager Features
- [ ] View HR dashboard
- [ ] See employee statistics
- [ ] View department distribution
- [ ] Create an announcement
- [ ] Set announcement priority
- [ ] View all announcements
- [ ] View employee list

### Employee Features
- [ ] View personal dashboard
- [ ] See profile information
- [ ] View company announcements
- [ ] Check account status

---

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError`

**Solution:**
1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

2. Check MongoDB connection string in `.env`
3. For MongoDB Atlas, whitelist your IP address

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `server/.env`:
```env
PORT=5001
```

### CORS Issues

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Verify `server/app.js` has correct CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### JWT Token Issues

**Error:** `Invalid token` or `Token expired`

**Solution:**
1. Clear browser localStorage
2. Login again
3. Check JWT_SECRET in `.env`

---

## 📊 Database Verification

### Check MongoDB Collections

```bash
# Connect to MongoDB
mongosh

# Switch to database
use iam_system

# View collections
show collections

# Count documents
db.users.countDocuments()
db.auditlogs.countDocuments()
db.announcements.countDocuments()

# View sample data
db.users.find().limit(5)
db.auditlogs.find().sort({timestamp: -1}).limit(10)
```

---

## 🎨 Accessing Different Dashboards

### Admin Dashboard
- URL: `http://localhost:5173/admin`
- Features:
  - Real-time statistics
  - Recent activity feed
  - System health monitoring
  - User management link
  - Audit logs link

### HR Dashboard
- URL: `http://localhost:5173/hr`
- Features:
  - Employee statistics
  - Department breakdown
  - Role distribution
  - Recent hires count
  - Announcement management

### User Dashboard
- URL: `http://localhost:5173/dashboard`
- Features:
  - Profile information
  - Company announcements
  - Account status
  - Security information

### User Management
- URL: `http://localhost:5173/users`
- Access: Admin only
- Features:
  - View all users
  - Search users
  - Filter by role
  - Deactivate users

### Audit Logs
- URL: `http://localhost:5173/audit-logs`
- Access: Admin only
- Features:
  - View all system activities
  - Filter by action type
  - See user details
  - Track IP addresses

### Announcements
- URL: `http://localhost:5173/announcements`
- Access: HR Manager only
- Features:
  - Create announcements
  - Set priority levels
  - View all announcements
  - Auto-expiration tracking

---

## 🔐 Security Notes

### Default Credentials
⚠️ **Change these in production!**

- Admin: `testadmin@company.com` / `admin123`
- HR: `testhr@company.com` / `hr123`
- Employee: `testemployee@company.com` / `user123`

### JWT Secret
⚠️ **Change JWT_SECRET in production!**

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Security
- Use strong passwords
- Enable authentication
- Use SSL/TLS for connections
- Whitelist IP addresses

---

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Backend starts without errors
2. ✅ Frontend loads at `http://localhost:5173`
3. ✅ You can register a new user
4. ✅ Login redirects to dashboard
5. ✅ Dashboard shows real data (not "0" or "N/A")
6. ✅ Admin can see user list
7. ✅ Audit logs show activities
8. ✅ HR can create announcements
9. ✅ Employees can see announcements

---

## 📞 Need Help?

### Check Logs

**Backend logs:**
```bash
cd server
npm start
# Watch for errors in console
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Common Issues

1. **No data showing:** Check MongoDB connection
2. **Login fails:** Verify user exists in database
3. **403 Forbidden:** Check user role and permissions
4. **500 Error:** Check backend console for errors

---

## 🚀 Next Steps

Once everything is running:

1. Create multiple test users with different roles
2. Test all features systematically
3. Check audit logs to see tracked activities
4. Create announcements and verify they appear
5. Test user management features
6. Explore the analytics and statistics

---

## 🎯 Quick Commands Reference

```bash
# Start backend
cd server && npm start

# Start frontend
cd client && npm run dev

# Run tests
cd server && node test-api.js

# Check MongoDB
mongosh
use iam_system
db.users.find()

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

**🎉 You're all set! Enjoy using the SecureIAM System!**
