# Validation Setup Guide

## Overview
This document explains the duplicate prevention system for email and phone numbers in the registration process.

## Backend Changes

### 1. Database Schema (server/models/user.js)
- Email field already has `unique: true` constraint
- Added sparse unique index for phone numbers (only validates non-empty values)
- Phone numbers can be empty, but if provided, must be unique

### 2. Registration Controller (server/controllers/auth.controller.js)
- Checks for duplicate email before registration
- Checks for duplicate phone number (if provided)
- Returns specific error messages with field information:
  - `{ message: "User with this email already exists", field: "email" }`
  - `{ message: "User with this phone number already exists", field: "phoneNumber" }`
- Handles MongoDB duplicate key errors (code 11000)

### 3. Database Index Setup
Run this command once to create the phone number index:
```bash
cd server
npm run create-indexes
```

This creates a sparse unique index that:
- Allows multiple empty phone numbers
- Prevents duplicate non-empty phone numbers
- Works efficiently with MongoDB

## Frontend Changes

### 1. Register Component (client/src/pages/Register.jsx)
- Added comprehensive field validation
- Real-time validation as users type
- On-blur validation for better UX
- Displays backend duplicate errors on specific fields
- Visual feedback with red borders and error messages

### 2. AuthContext (client/src/context/AuthContext.jsx)
- Updated to pass field information from backend errors
- Enables showing duplicate errors on the correct input field

## Validation Rules

### Email
- Required field
- Must be valid email format
- Maximum 100 characters
- Must be unique across all users

### Phone Number
- Optional field
- If provided: 10-15 digits
- Allows international format (+, -, (), spaces)
- Must be unique if not empty

### Other Fields
- **First/Last Name**: 2-50 chars, letters only
- **Username**: 3-30 chars, alphanumeric with dots/hyphens/underscores
- **Password**: 8+ chars with uppercase, lowercase, number, special char
- **Position**: 2-100 chars (optional)

## Testing

### Test Duplicate Email
1. Register a user with email: test@example.com
2. Try to register another user with the same email
3. Should see: "User with this email already exists" on the email field

### Test Duplicate Phone
1. Register a user with phone: +1 234 567 8900
2. Try to register another user with the same phone
3. Should see: "User with this phone number already exists" on the phone field

### Test Empty Phone Numbers
1. Register multiple users without phone numbers
2. Should work fine (empty values are not checked for uniqueness)

## Error Handling

The system handles three types of duplicate scenarios:

1. **Pre-check validation**: Backend checks before creating user
2. **MongoDB duplicate key error**: Catches database-level duplicates
3. **Frontend display**: Shows errors on the specific field that has the duplicate

## Maintenance

If you need to remove the phone number uniqueness constraint:
1. Remove the index from the database
2. Remove the sparse index code from user.js
3. Remove the duplicate check from auth.controller.js
