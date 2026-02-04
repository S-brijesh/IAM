const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  getAuditLogs,
  getSystemStats
} = require("../controllers/admin.controller");

// Admin Dashboard
router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  getAdminDashboard
);

// Get all users
router.get(
  "/admin/users",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  getAllUsers
);

// Get user by ID
router.get(
  "/admin/users/:id",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  getUserById
);

// Update user
router.put(
  "/admin/users/:id",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  updateUser
);

// Delete/Deactivate user
router.delete(
  "/admin/users/:id",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  deleteUser
);

// Activate user
router.patch(
  "/admin/users/:id/activate",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  activateUser
);

// Get audit logs
router.get(
  "/admin/audit-logs",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  getAuditLogs
);

// Get system statistics
router.get(
  "/admin/stats",
  authenticate,
  authorizeRoles(["IT_ADMIN"]),
  getSystemStats
);

module.exports = router;
