const User = require("../models/user");
const Announcement = require("../models/announcement");
const AuditLog = require("../models/auditLog");

/**
 * GET HR DASHBOARD
 */
exports.getHRDashboard = async (req, res) => {
    try {
        // Get employee statistics
        const totalEmployees = await User.countDocuments({ isActive: true });

        const employeesByDepartment = await User.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$department", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const employeesByRole = await User.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get recent hires (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentHires = await User.countDocuments({
            joiningDate: { $gte: thirtyDaysAgo }
        });

        // Get active announcements
        const activeAnnouncements = await Announcement.countDocuments({
            isActive: true,
            expiresAt: { $gte: new Date() }
        });

        return res.json({
            message: "HR Dashboard Data",
            statistics: {
                totalEmployees,
                recentHires,
                activeAnnouncements,
                employeesByDepartment,
                employeesByRole
            }
        });
    } catch (err) {
        console.error("HR Dashboard error:", err);
        return res.status(500).json({ message: "Failed to load HR dashboard" });
    }
};

/**
 * GET ALL EMPLOYEES WITH FILTERS
 */
exports.getAllEmployees = async (req, res) => {
    try {
        const { department, role, search, isActive = 'true' } = req.query;
        
        const query = { isActive: isActive === 'true' };
        
        if (department) query.department = department;
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const employees = await User.find(query)
            .select('-password')
            .sort({ joiningDate: -1 });

        return res.json({
            message: "Employees retrieved successfully",
            count: employees.length,
            employees
        });
    } catch (err) {
        console.error("Get employees error:", err);
        return res.status(500).json({ message: "Failed to retrieve employees" });
    }
};

/**
 * GET EMPLOYEE BY ID
 */
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Get employee's recent activity
        const recentActivity = await AuditLog.find({ userId: employee._id })
            .sort({ timestamp: -1 })
            .limit(10);

        return res.json({
            message: "Employee retrieved successfully",
            employee,
            recentActivity
        });
    } catch (err) {
        console.error("Get employee error:", err);
        return res.status(500).json({ message: "Failed to retrieve employee" });
    }
};

/**
 * UPDATE EMPLOYEE
 */
exports.updateEmployee = async (req, res) => {
    try {
        const { department, position, role } = req.body;
        
        const employee = await User.findByIdAndUpdate(
            req.params.id,
            { department, position, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Log the update
        await AuditLog.create({
            userId: req.user.userId,
            action: `EMPLOYEE_UPDATED: ${employee.email}`,
            ip: req.ip
        });

        return res.json({
            message: "Employee updated successfully",
            employee
        });
    } catch (err) {
        console.error("Update employee error:", err);
        return res.status(500).json({ message: "Failed to update employee" });
    }
};

/**
 * POST ANNOUNCEMENT
 */
exports.postAnnouncement = async (req, res) => {
    try {
        const { title, content, priority } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const announcement = await Announcement.create({
            title,
            content,
            priority: priority || "MEDIUM",
            postedBy: req.user.userId
        });

        // Log the announcement
        await AuditLog.create({
            userId: req.user.userId,
            action: `ANNOUNCEMENT_POSTED: ${title}`,
            ip: req.ip
        });

        return res.status(201).json({
            message: "Announcement posted successfully",
            announcement
        });
    } catch (err) {
        console.error("Post announcement error:", err);
        return res.status(500).json({ message: "Failed to post announcement" });
    }
};

/**
 * GET ALL ANNOUNCEMENTS
 */
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({
            isActive: true,
            expiresAt: { $gte: new Date() }
        })
            .populate('postedBy', 'firstName lastName role')
            .sort({ createdAt: -1 })
            .limit(20);

        return res.json({
            message: "Announcements retrieved successfully",
            count: announcements.length,
            announcements
        });
    } catch (err) {
        console.error("Get announcements error:", err);
        return res.status(500).json({ message: "Failed to retrieve announcements" });
    }
};

/**
 * DELETE ANNOUNCEMENT
 */
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        // Log the deletion
        await AuditLog.create({
            userId: req.user.userId,
            action: `ANNOUNCEMENT_DELETED: ${announcement.title}`,
            ip: req.ip
        });

        return res.json({
            message: "Announcement deleted successfully"
        });
    } catch (err) {
        console.error("Delete announcement error:", err);
        return res.status(500).json({ message: "Failed to delete announcement" });
    }
};
