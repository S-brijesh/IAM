# 👥 User Scenarios - SecureIAM System

This document outlines various user scenarios and workflows for testing and understanding the IAM system.

## 📋 Table of Contents
1. [New User Registration](#scenario-1-new-user-registration)
2. [Regular User Login & Dashboard Access](#scenario-2-regular-user-login--dashboard-access)
3. [Admin User Registration & Access](#scenario-3-admin-user-registration--access)
4. [Unauthorized Access Attempts](#scenario-4-unauthorized-access-attempts)
5. [Token Expiration & Re-authentication](#scenario-5-token-expiration--re-authentication)
6. [User Logout](#scenario-6-user-logout)

---

## Scenario 1: New User Registration

### User Story
*As a new user, I want to create an account so that I can access the IAM system.*

### Steps
1. Navigate to the home page (`http://localhost:5173/`)
2. Click on "Get Started" or "Register" button
3. Fill in the registration form:
   - **Username**: `johndoe`
   - **Email**: `john@example.com`
   - **Password**: `password123`
   - **Confirm Password**: `password123`
   - **Account Type**: `Regular User`
4. Click "Create Account"

### Expected Results
- ✅ Success message appears: "Registration successful! Redirecting to login..."
- ✅ User is redirected to login page after 2 seconds
- ✅ User data is stored in MongoDB with hashed password
- ✅ Audit log entry created for `USER_REGISTERED`

### Error Cases
- ❌ **Passwords don't match**: "Passwords do not match"
- ❌ **Email already exists**: "User already exists"
- ❌ **Missing fields**: "All fields are required"
- ❌ **Password too short**: "Password must be at least 6 characters"

---

## Scenario 2: Regular User Login & Dashboard Access

### User Story
*As a registered user, I want to login and access my dashboard to view my profile information.*

### Steps
1. Navigate to login page (`/login`)
2. Enter credentials:
   - **Email**: `john@example.com`
   - **Password**: `password123`
3. Click "Sign in"
4. View the user dashboard

### Expected Results
- ✅ JWT token is generated and stored in localStorage
- ✅ User is redirected to `/dashboard`
- ✅ Navbar shows "Dashboard" and "Logout" buttons
- ✅ Dashboard displays:
  - Welcome message with user role
  - Profile card with User ID and Role
  - Account status (Active)
  - Security level (High)
  - Quick stats cards
- ✅ Audit log entry created for `LOGIN_SUCCESS`

### Navigation Options
- Can access: `/`, `/dashboard`
- Cannot access: `/admin` (403 Forbidden)

---

## Scenario 3: Admin User Registration & Access

### User Story
*As an administrator, I want to create an admin account and access the admin dashboard to manage the system.*

### Steps

#### Option A: Register via UI
1. Navigate to `/register`
2. Fill in the form:
   - **Username**: `admin`
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   - **Confirm Password**: `admin123`
   - **Account Type**: `Administrator`
3. Click "Create Account"
4. Login with admin credentials
5. Navigate to `/admin` or click "Admin" button in navbar

#### Option B: Use Seed Script
1. Open terminal in `server` directory
2. Run: `npm run seed:admin`
3. Login with:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`

### Expected Results
- ✅ Admin user created with `role: "ADMIN"`
- ✅ After login, navbar shows "Admin" button
- ✅ Admin dashboard displays:
  - System statistics (Total Users, Active Sessions, etc.)
  - Recent activity log
  - Security status panel
  - System health metrics
- ✅ Can access both `/dashboard` and `/admin`

---

## Scenario 4: Unauthorized Access Attempts

### User Story
*As the system, I want to prevent unauthorized access to protected resources.*

### Test Cases

#### 4.1: Access Protected Route Without Login
**Steps:**
1. Logout (if logged in)
2. Try to navigate to `/dashboard` directly

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Dashboard content not visible

#### 4.2: Regular User Accessing Admin Route
**Steps:**
1. Login as regular user (`john@example.com`)
2. Try to navigate to `/admin`

**Expected Result:**
- ✅ Redirected to `/dashboard`
- ✅ Admin dashboard not accessible
- ✅ "Admin" button not visible in navbar

#### 4.3: Invalid Login Credentials
**Steps:**
1. Navigate to `/login`
2. Enter:
   - **Email**: `john@example.com`
   - **Password**: `wrongpassword`
3. Click "Sign in"

**Expected Result:**
- ✅ Error message: "Invalid credentials"
- ✅ User remains on login page
- ✅ Audit log entry for `LOGIN_FAILED`

#### 4.4: Invalid Token
**Steps:**
1. Login successfully
2. Open browser DevTools → Application → Local Storage
3. Modify the `token` value
4. Try to access `/dashboard`

**Expected Result:**
- ✅ API returns 401 Unauthorized
- ✅ User is logged out automatically
- ✅ Redirected to `/login`

---

## Scenario 5: Token Expiration & Re-authentication

### User Story
*As a security measure, I want tokens to expire after 1 hour, requiring users to re-authenticate.*

### Steps
1. Login successfully
2. Wait for token to expire (1 hour) OR manually set an expired token
3. Try to access a protected route or make an API call

### Expected Results
- ✅ API returns 401 Unauthorized
- ✅ User is automatically logged out
- ✅ Token and user data removed from localStorage
- ✅ Redirected to `/login`
- ✅ Message: "Session expired, please login again"

### Testing Token Expiration Quickly
1. Login successfully
2. Open `server/controllers/auth.controller.js`
3. Temporarily change JWT expiration to `10s`:
   ```javascript
   const token = jwt.sign(
     { userId: user._id, role: user.role },
     process.env.JWT_SECRET,
     { expiresIn: "10s" } // Changed from "1h"
   );
   ```
4. Login and wait 10 seconds
5. Try to access dashboard

---

## Scenario 6: User Logout

### User Story
*As a logged-in user, I want to logout securely to end my session.*

### Steps
1. Login as any user
2. Click "Logout" button in navbar

### Expected Results
- ✅ Token removed from localStorage
- ✅ User data removed from localStorage
- ✅ Redirected to home page (`/`)
- ✅ Navbar shows "Login" and "Register" buttons
- ✅ Cannot access protected routes anymore

---

## 🧪 Complete Testing Workflow

### Full User Journey
1. **Register** → Create new account
2. **Login** → Authenticate
3. **Dashboard** → View profile
4. **Logout** → End session
5. **Login Again** → Re-authenticate
6. **Try Admin Access** → Verify authorization
7. **Logout** → Clean exit

### Admin Journey
1. **Register as Admin** → Create admin account
2. **Login** → Authenticate
3. **User Dashboard** → Access regular features
4. **Admin Dashboard** → Access admin features
5. **Monitor Activities** → View system stats
6. **Logout** → End session

---

## 📊 Expected Audit Log Entries

After completing all scenarios, your MongoDB `auditlogs` collection should contain:

```javascript
[
  {
    userId: ObjectId("..."),
    action: "USER_REGISTERED",
    ip: "::1",
    timestamp: ISODate("...")
  },
  {
    userId: ObjectId("..."),
    action: "LOGIN_SUCCESS",
    ip: "::1",
    timestamp: ISODate("...")
  },
  {
    userId: null,
    action: "LOGIN_FAILED",
    ip: "::1",
    timestamp: ISODate("...")
  }
]
```

---

## 🎯 Key Testing Points

### Security
- ✅ Passwords are never stored in plain text
- ✅ JWT tokens expire after 1 hour
- ✅ Protected routes require valid authentication
- ✅ Admin routes require ADMIN role
- ✅ Invalid tokens are rejected

### User Experience
- ✅ Clear error messages
- ✅ Smooth animations and transitions
- ✅ Responsive design on all devices
- ✅ Intuitive navigation
- ✅ Loading states for async operations

### Data Integrity
- ✅ Duplicate emails prevented
- ✅ All user actions logged
- ✅ Database constraints enforced
- ✅ Input validation on client and server

---

## 🐛 Common Issues & Solutions

### Issue: "CORS Error"
**Solution:** Ensure backend CORS is configured for `http://localhost:5173`

### Issue: "Cannot connect to MongoDB"
**Solution:** Check MongoDB is running and `MONGO_URI` is correct in `.env`

### Issue: "Token not being saved"
**Solution:** Check browser console for errors, ensure localStorage is enabled

### Issue: "Admin route accessible by regular user"
**Solution:** Verify `authorizeRoles` middleware is applied to admin routes

---

## 📝 Notes

- All passwords in examples are for **demonstration only**
- In production, use stronger passwords and additional security measures
- JWT secret should be a long, random string in production
- Consider implementing refresh tokens for better UX
- Add rate limiting to prevent brute force attacks
