const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const AuditLog = require("../models/auditLog");

/**
 * REGISTER USER
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "USER"
    });

    // Audit log
    await AuditLog.create({
      userId: user._id,
      action: "USER_REGISTERED",
      ip: req.ip
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * LOGIN USER
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    // User not found or inactive
    if (!user || !user.isActive) {
      await AuditLog.create({
        userId: null,
        action: "LOGIN_FAILED",
        ip: req.ip
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        ip: req.ip
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Audit log for success
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      ip: req.ip
    });

    return res.json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
