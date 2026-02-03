const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles(["ADMIN"]),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
