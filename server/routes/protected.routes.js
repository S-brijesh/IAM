const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserActivityLogs
} = require("../controllers/user.controller");

// Get user profile
router.get("/profile", authenticate, getUserProfile);

// Update user profile
router.put("/profile", authenticate, updateUserProfile);

// Change password
router.post("/change-password", authenticate, changePassword);

// Get user activity logs
router.get("/my-activity", authenticate, getUserActivityLogs);

module.exports = router;
