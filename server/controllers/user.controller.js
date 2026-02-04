const bcrypt = require("bcrypt");
const User = require("../models/user");
const AuditLog = require("../models/auditLog");

/**
 * GET USER PROFILE
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "Profile retrieved successfully",
            user
        });
    } catch (err) {
        console.error("Get profile error:", err);
        return res.status(500).json({ message: "Failed to retrieve profile" });
    }
};

/**
 * UPDATE USER PROFILE
 */
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, department, position } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName, phoneNumber, department, position },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log the update
        await AuditLog.create({
            userId: req.user.userId,
            action: "PROFILE_UPDATED",
            ip: req.ip
        });

        return res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        console.error("Update profile error:", err);
        return res.status(500).json({ message: "Failed to update profile" });
    }
};

/**
 * CHANGE PASSWORD
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            await AuditLog.create({
                userId: req.user.userId,
                action: "PASSWORD_CHANGE_FAILED: Incorrect current password",
                ip: req.ip
            });
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Log the password change
        await AuditLog.create({
            userId: req.user.userId,
            action: "PASSWORD_CHANGED",
            ip: req.ip
        });

        return res.json({
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error("Change password error:", err);
        return res.status(500).json({ message: "Failed to change password" });
    }
};

/**
 * GET USER ACTIVITY LOGS
 */
exports.getUserActivityLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({ userId: req.user.userId })
            .sort({ timestamp: -1 })
            .limit(20);

        return res.json({
            message: "Activity logs retrieved successfully",
            count: logs.length,
            logs
        });
    } catch (err) {
        console.error("Get activity logs error:", err);
        return res.status(500).json({ message: "Failed to retrieve activity logs" });
    }
};

module.exports = exports;
