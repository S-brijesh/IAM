# API Route Testing Guide

This guide provides step-by-step instructions to test all available routes in the IAM Server.

**Base URL**: `http://localhost:5000`

---

## 1. General Routes

### A. Health Check
**Method**: `GET`
**URL**: `/`

| Scenario | Expected Status | Expected Response |
|----------|-----------------|-------------------|
| **1. Server Running** | `200 OK` | `"IAM Backend Running"` |

**Testing Steps:**
1. Open browser or Postman.
2. Go to `http://localhost:5000/`.
3. Verify the text "IAM Backend Running" is displayed.

---

## 2. Auth Routes

### A. Register User
**Method**: `POST`
**URL**: `/api/auth/register`

| Scenario | Request Body | Expected Status | Expected Response |
|----------|--------------|-----------------|-------------------|
| **1. Success** | `{ "username": "testuser", "email": "test@example.com", "password": "password123" }` | `201 Created` | `{ "message": "User registered successfully", "userId": "..." }` |
| **2. Missing Fields** | `{ "email": "test@example.com" }` | `400 Bad Request` | `{ "message": "All fields are required" }` |
| **3. Create Admin** | `{ "username": "admin", "email": "admin@example.com", "password": "admin123", "role": "ADMIN" }` | `201 Created` | `{ "message": "User registered successfully", ... }` |
| **4. User Exists** | `{ "username": "testuser", "email": "test@example.com", "password": "password123" }` *(Run this after Scenario 1)* | `409 Conflict` | `{ "message": "User already exists" }` |

**Testing Steps:**
1. Open Postman or Insomnia.
2. Create a `POST` request to `http://localhost:5000/api/auth/register`.
3. Set Header `Content-Type: application/json`.
4. Enter the JSON body for the "Success" scenario.
5. Send request and verify 201 status.
6. Try the "Missing Fields" body and verify 400.
7. Try the "Success" body again and verify 409.

---

### B. Login User
**Method**: `POST`
**URL**: `/api/auth/login`

| Scenario | Request Body | Expected Status | Expected Response |
|----------|--------------|-----------------|-------------------|
| **1. Success** | `{ "email": "test@example.com", "password": "password123" }` | `200 OK` | `{ "message": "Login successful", "token": "..." }` |
| **2. Invalid Credentials** | `{ "email": "test@example.com", "password": "wrongpassword" }` | `401 Unauthorized` | `{ "message": "Invalid credentials" }` |
| **3. Non-existent User** | `{ "email": "notfound@example.com", "password": "password123" }` | `401 Unauthorized` | `{ "message": "Invalid credentials" }` |

**Testing Steps:**
1. Create a `POST` request to `http://localhost:5000/api/auth/login`.
2. Set Header `Content-Type: application/json`.
3. Enter the valid JSON body.
4. Send request and **COPY the returned token** from the response. You will need this for protected routes.

---

## 3. Protected Routes

### A. User Profile
**Method**: `GET`
**URL**: `/api/profile`

| Scenario | Headers | Expected Status | Expected Response |
|----------|---------|-----------------|-------------------|
| **1. Success** | `Authorization: Bearer <YOUR_TOKEN>` | `200 OK` | `{ "message": "Protected route accessed", "user": { ... } }` |
| **2. No Token** | *(None)* | `401 Unauthorized` | `{ "message": "Access denied. No token provided." }` |
| **3. Invalid Token** | `Authorization: Bearer invalid_token_123` | `401 Unauthorized` | `{ "message": "Invalid or expired token" }` |

**Testing Steps:**
1. Create a `GET` request to `http://localhost:5000/api/profile`.
2. Go to the "Headers" tab (or "Auth" -> "Bearer Token").
3. Add `Authorization` header with value `Bearer <PASTE_TOKEN_HERE>`.
4. Send request and verify you see the user details.
5. Remove the header to test specific error cases.

---

## 4. Admin Routes

### A. Admin Dashboard
**Method**: `GET`
**URL**: `/api/admin/dashboard`

**Prerequisite**: You need a user with `role: "ADMIN"`.
> **Note**: If you just registered via the API, your default role is likely not ADMIN (unless you manually update it in the database).

| Scenario | Headers | Expected Status | Expected Response |
|----------|---------|-----------------|-------------------|
| **1. Success (Admin)** | `Authorization: Bearer <ADMIN_TOKEN>` | `200 OK` | `{ "message": "Welcome Admin" }` |
| **2. Forbidden (User)** | `Authorization: Bearer <USER_TOKEN>` | `403 Forbidden` | `{ "message": "Forbidden: Access denied" }` |
| **3. No Token** | *(None)* | `401 Unauthorized` | `{ "message": "Access denied. No token provided." }` |

**Testing Steps:**
1. Create a `GET` request to `http://localhost:5000/api/admin/dashboard`.
2. Use the token from a standard user (from previous login).
3. Verify you receive `403 Forbidden`.
4. **(Optional)** Manually update a user in MongoDB to have `"role": "ADMIN"`.
5. Login again to get a new token with the ADMIN role.
6. Use the new token and verify you receive `200 OK`.
