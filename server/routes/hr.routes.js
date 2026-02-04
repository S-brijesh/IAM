const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
    getHRDashboard,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    postAnnouncement,
    getAnnouncements,
    deleteAnnouncement
} = require("../controllers/hr.controller");

// HR Dashboard - HR_MANAGER and IT_ADMIN only
router.get(
    "/hr/dashboard",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    getHRDashboard
);

// Get all employees - HR_MANAGER and IT_ADMIN only
router.get(
    "/hr/employees",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    getAllEmployees
);

// Get employee by ID - HR_MANAGER and IT_ADMIN only
router.get(
    "/hr/employees/:id",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    getEmployeeById
);

// Update employee - HR_MANAGER and IT_ADMIN only
router.put(
    "/hr/employees/:id",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    updateEmployee
);

// Post announcement - HR_MANAGER and IT_ADMIN only
router.post(
    "/hr/announcements",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    postAnnouncement
);

// Delete announcement - HR_MANAGER and IT_ADMIN only
router.delete(
    "/hr/announcements/:id",
    authenticate,
    authorizeRoles(["HR_MANAGER", "IT_ADMIN"]),
    deleteAnnouncement
);

// Get announcements - All authenticated users
router.get(
    "/announcements",
    authenticate,
    getAnnouncements
);

module.exports = router;
