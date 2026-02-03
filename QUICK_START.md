# 🚀 Quick Start Guide - SecureIAM

Get your IAM system up and running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v16+) - Run `node --version`
- ✅ MongoDB installed and running - Run `mongod --version`
- ✅ npm installed - Run `npm --version`

---

## 🎯 Step-by-Step Setup

### Step 1: Setup Backend (2 minutes)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
# Copy and paste this into server/.env:
PORT=5000
MONGO_URI=mongodb://localhost:27017/iam
JWT_SECRET=my_super_secret_jwt_key_12345

# Start the backend server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected
```

✅ Backend is now running on `http://localhost:5000`

---

### Step 2: Setup Frontend (2 minutes)

Open a **NEW terminal window** and run:

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in XXXms

➜  Local:   http://localhost:5173/
```

✅ Frontend is now running on `http://localhost:5173`

---

### Step 3: Create Admin User (30 seconds)

Open a **THIRD terminal window**:

```bash
# Navigate to server directory
cd server

# Run the seed script
npm run seed:admin
```

**Expected Output:**
```
MongoDB connected
Admin user created successfully
Email: admin@example.com
Password: admin123
```

✅ Admin account is ready!

---

## 🎮 Test the Application

### Test 1: Access the Application
1. Open browser: `http://localhost:5173`
2. You should see a beautiful landing page with:
   - "Secure Identity & Access Management" hero section
   - Features grid
   - "Get Started" and "Sign In" buttons

### Test 2: Login as Admin
1. Click "Sign In" or navigate to `/login`
2. Enter credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. Click "Sign in"
4. You should be redirected to the dashboard

### Test 3: Access Admin Dashboard
1. After logging in, click "Admin" button in navbar
2. You should see:
   - System statistics
   - Recent activity
   - Security status
   - System health

### Test 4: Create a Regular User
1. Logout (click "Logout" in navbar)
2. Click "Register"
3. Fill in the form:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Password**: `password123`
   - **Confirm Password**: `password123`
   - **Account Type**: `Regular User`
4. Click "Create Account"
5. Login with the new credentials
6. Notice: No "Admin" button in navbar (correct behavior!)

---

## 🔍 Verify Everything is Working

### Backend Health Check
```bash
# In a new terminal or browser
curl http://localhost:5000
```
**Expected:** `IAM Backend Running`

### Database Check
```bash
# Connect to MongoDB
mongosh

# Switch to IAM database
use iam

# Check users collection
db.users.find().pretty()

# Check audit logs
db.auditlogs.find().pretty()
```

---

## 📱 Quick Feature Tour

### Public Pages
- **Home** (`/`) - Landing page
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user signup

### Protected Pages (Requires Login)
- **Dashboard** (`/dashboard`) - User profile and info
- **Admin Dashboard** (`/admin`) - Admin-only features

### Try These Actions
1. ✅ Register a new user
2. ✅ Login with credentials
3. ✅ View dashboard
4. ✅ Try to access `/admin` as regular user (should be blocked)
5. ✅ Logout
6. ✅ Login as admin
7. ✅ Access admin dashboard
8. ✅ View system statistics

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** `MongoDB connection failed`
**Solution:** 
```bash
# Start MongoDB
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

### Frontend shows blank page
**Solution:**
1. Check browser console for errors (F12)
2. Ensure backend is running on port 5000
3. Clear browser cache and reload

### CORS errors
**Solution:**
- Verify backend has CORS enabled for `http://localhost:5173`
- Check `server/app.js` has CORS middleware

### Can't login
**Solution:**
1. Check MongoDB is running
2. Verify user exists: `db.users.find()`
3. Check backend console for errors
4. Verify JWT_SECRET is set in `.env`

---

## 🎯 Next Steps

Now that everything is running:

1. 📖 Read `USER_SCENARIOS.md` for detailed testing scenarios
2. 🧪 Import `IAM_Postman_Collection.json` into Postman for API testing
3. 📚 Check `API_TESTING.md` for API documentation
4. 🎨 Explore the UI and test different user flows
5. 🔒 Review security features and audit logs

---

## 🛑 Stopping the Application

### Stop Frontend
In the terminal running Vite:
- Press `Ctrl + C`

### Stop Backend
In the terminal running the server:
- Press `Ctrl + C`

### Stop MongoDB (Optional)
```bash
# Windows
net stop MongoDB

# macOS/Linux
sudo systemctl stop mongod
```

---

## 📊 Default Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Test User (Create via UI)
- **Email**: `test@example.com`
- **Password**: `password123`
- **Role**: USER

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Admin user created
- [ ] Can access home page
- [ ] Can login as admin
- [ ] Can access admin dashboard
- [ ] Can register new users
- [ ] Can logout successfully

**All checked?** 🎉 **You're all set!**

---

## 💡 Pro Tips

1. **Keep terminals organized**: Use 3 separate terminal windows
   - Terminal 1: Backend server
   - Terminal 2: Frontend dev server
   - Terminal 3: Commands (seed, mongo, etc.)

2. **Use browser DevTools**: 
   - Network tab to see API calls
   - Application tab to view localStorage (tokens)
   - Console for any errors

3. **Test in incognito**: For a fresh session without cached data

4. **Use Postman**: Import the collection for easy API testing

---

## 🆘 Need Help?

- Check the main `README.md` for detailed documentation
- Review `USER_SCENARIOS.md` for testing workflows
- Examine `API_TESTING.md` for API details
- Look at browser console for frontend errors
- Check server terminal for backend errors

**Happy Testing! 🚀**
