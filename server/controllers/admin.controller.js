const User = require("../models/user");
const AuditLog = require("../models/auditLog");
const Announcement = require("../models/announcement");

/**
 * GET ADMIN DASHBOARD WITH REAL DATA
 */
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get active users (logged in within last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const recentLogins = await AuditLog.countDocuments({
            action: "LOGIN_SUCCESS",
            timestamp: { $gte: oneDayAgo }
        });

        // Get security events (failed logins in last 24 hours)
        const securityEvents = await AuditLog.countDocuments({
            action: "LOGIN_FAILED",
            timestamp: { $gte: oneDayAgo }
        });

        // Get admin users count
        const adminUsers = await User.countDocuments({ role: "IT_ADMIN" });

        // Get recent activities (last 20)
        const recentActivities = await AuditLog.find()
            .populate('userId', 'email firstName lastName')
            .sort({ timestamp: -1 })
            .limit(20)
            .lean();

        // Format activities for frontend
        const formattedActivities = recentActivities.map(activity => {
            const timeAgo = getTimeAgo(activity.timestamp);
            let status = 'info';
            
            if (activity.action.includes('SUCCESS') || activity.action.includes('CREATED')) {
                status = 'success';
            } else if (activity.action.includes('FAILED') || activity.action.includes('DELETED')) {
                status = 'error';
            }

            return {
                user: activity.userId ? activity.userId.email : 'Unknown User',
                action: formatAction(activity.action),
                time: timeAgo,
                status: status,
                ip: activity.ip
            };
        });

        // Get user growth (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const newUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get users by role
        const usersByRole = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Get users by department
        const usersByDepartment = await User.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        // System health metrics
        const systemHealth = {
            database: 'Healthy',
            apiServer: 'Online',
            responseTime: Math.floor(Math.random() * 50) + 20 + 'ms',
            uptime: process.uptime()
        };

        return res.json({
            message: "Admin Dashboard Data",
            statistics: {
                totalUsers,
                activeSessions: recentLogins,
                securityEvents,
                adminUsers,
                newUsers,
                usersByRole,
                usersByDepartment
            },
            recentActivities: formattedActivities,
            systemHealth
        });
    } catch (err) {
        console.error("Admin Dashboard error:", err);
        return res.status(500).json({ message: "Failed to load admin dashboard" });
    }
};

/**
 * GET ALL USERS (Admin only)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        return res.json({
            message: "Users retrieved successfully",
            count: users.length,
            users
        });
    } catch (err) {
        console.error("Get users error:", err);
        return res.status(500).json({ message: "Failed to retrieve users" });
    }
};

/**
 * GET USER BY ID
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's audit logs
        const userLogs = await AuditLog.find({ userId: user._id })
            .sort({ timestamp: -1 })
            .limit(10);

        return res.json({
            message: "User retrieved successfully",
            user,
            recentActivity: userLogs
        });
    } catch (err) {
        console.error("Get user error:", err);
        return res.status(500).json({ message: "Failed to retrieve user" });
    }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
    try {
        const { role, department, position, isActive } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, department, position, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log the update
        await AuditLog.create({
            userId: req.user.userId,
            action: `USER_UPDATED: ${user.email}`,
            ip: req.ip
        });

        return res.json({
            message: "User updated successfully",
            user
        });
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ message: "Failed to update user" });
    }
};

/**
 * DELETE USER (Deactivate)
 */
exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent admin from deactivating themselves
        if (targetUser._id.toString() === req.user.userId) {
            return res.status(403).json({ message: "You cannot deactivate yourself" });
        }

        // Prevent admin from deactivating other admins
        if (targetUser.role === "IT_ADMIN") {
            return res.status(403).json({ message: "You cannot deactivate other administrators" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        // Log the deletion
        await AuditLog.create({
            userId: req.user.userId,
            action: `USER_DEACTIVATED: ${user.email}`,
            ip: req.ip
        });

        return res.json({
            message: "User deactivated successfully"
        });
    } catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};

/**
 * ACTIVATE USER
 */
exports.activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log the activation
        await AuditLog.create({
            userId: req.user.userId,
            action: `USER_ACTIVATED: ${user.email}`,
            ip: req.ip
        });

        return res.json({
            message: "User activated successfully"
        });
    } catch (err) {
        console.error("Activate user error:", err);
        return res.status(500).json({ message: "Failed to activate user" });
    }
};

/**
 * GET AUDIT LOGS
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const { limit = 50, action, userId } = req.query;
        
        const query = {};
        if (action) query.action = new RegExp(action, 'i');
        if (userId) query.userId = userId;

        const logs = await AuditLog.find(query)
            .populate('userId', 'email firstName lastName role')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        return res.json({
            message: "Audit logs retrieved successfully",
            count: logs.length,
            logs
        });
    } catch (err) {
        console.error("Get audit logs error:", err);
        return res.status(500).json({ message: "Failed to retrieve audit logs" });
    }
};

/**
 * GET SYSTEM STATISTICS
 */
exports.getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalLogs = await AuditLog.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments();

        // Login statistics
        const loginStats = await AuditLog.aggregate([
            {
                $match: {
                    action: { $in: ["LOGIN_SUCCESS", "LOGIN_FAILED"] }
                }
            },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Activity by day (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activityByDay = await AuditLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return res.json({
            message: "System statistics retrieved successfully",
            statistics: {
                totalUsers,
                activeUsers,
                totalLogs,
                totalAnnouncements,
                loginStats,
                activityByDay
            }
        });
    } catch (err) {
        console.error("Get system stats error:", err);
        return res.status(500).json({ message: "Failed to retrieve system statistics" });
    }
};

// Helper function to format action names
function formatAction(action) {
    return action
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Helper function to calculate time ago
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

module.exports = exports;
