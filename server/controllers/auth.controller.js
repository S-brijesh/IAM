const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const AuditLog = require("../models/auditLog");

/**
 * REGISTER USER
 */
exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      department,
      position,
      phoneNumber
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !username || !email || !password) {
      await AuditLog.create({
        userId: null,
        action: "REGISTRATION_FAILED: Missing required fields",
        
      });
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      await AuditLog.create({
        userId: null,
        action: `REGISTRATION_FAILED: Email already exists - ${email}`,
        
      });
      return res.status(409).json({ 
        message: "User with this email already exists",
        field: "email"
      });
    }

    // Check if phone number already exists (only if provided and not empty)
    if (phoneNumber && phoneNumber.trim() !== "") {
      const existingPhone = await User.findOne({ phoneNumber: phoneNumber.trim() });
      if (existingPhone) {
        await AuditLog.create({
          userId: null,
          action: `REGISTRATION_FAILED: Phone number already exists - ${phoneNumber}`,
          
        });
        return res.status(409).json({ 
          message: "User with this phone number already exists",
          field: "phoneNumber"
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: role || "EMPLOYEE",
      department: department || "Engineering",
      position: position || "Employee",
      phoneNumber: phoneNumber ? phoneNumber.trim() : ""
    });

    // Audit log
    await AuditLog.create({
      userId: user._id,
      action: "USER_REGISTERED",
      
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      let message = "Duplicate entry detected";
      
      if (field === "email") {
        message = "User with this email already exists";
      } else if (field === "phoneNumber") {
        message = "User with this phone number already exists";
      }
      
      await AuditLog.create({
        userId: null,
        action: `REGISTRATION_FAILED: Duplicate ${field}`,
        
      });
      
      return res.status(409).json({ message, field });
    }
    
    await AuditLog.create({
      userId: null,
      action: "REGISTRATION_ERROR: System error",
      
    });
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
    if (!user) {
      await AuditLog.create({
        userId: null,
        action: "LOGIN_FAILED",
        
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }
    if(!user.isActive){
      await AuditLog.create({
        userId: user._id,
        action: "User is Inactive",
        
      });
      return res.status(401).json({ message: "User is Inactive" });
    }
    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        
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
