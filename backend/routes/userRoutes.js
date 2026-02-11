const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const tenant = require("../middleware/tenant");

const {
  inviteUser,
  getUsersByOrg,
  updateUserRole
} = require("../controllers/userController");

const router = express.Router();

// Only these roles can create employees
const adminRoles = ["SUPER_ADMIN", "HR_ADMIN"];

/**
 * SEND INVITATION (Future Module)
 */
router.post("/invite", auth, role(["SUPER_ADMIN"]), inviteUser);

/**
 * GET USERS OF ORG (For dashboard + tables)
 */
router.get("/org-users", auth, tenant, getUsersByOrg);

/**
 * UPDATE USER ROLE (Only Super Admin)
 */
router.put("/update-role/:userId", auth, role(["SUPER_ADMIN"]), updateUserRole);

/**
 * LIST USERS (Module 1 Requirement)
 */
router.get("/list", auth, tenant, async (req, res) => {
  try {
    const users = await User.find({
      organizationId: req.user.organizationId
    }).select("-password");

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * CREATE EMPLOYEE (Module 1: Add Employee)
 */
router.post("/create", auth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["HR_ADMIN", "PAYROLL_ADMIN"].includes(role)) {
      return res.status(403).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: role === "HR_ADMIN"
        ? ["manage_users", "manage_statutory"]
        : ["run_payroll"],
      organizationId: req.user.organizationId
    });

    res.status(201).json({
      message: `${role} created successfully`,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * STATS FOR DASHBOARD (Total Users)
 */
router.get("/stats", auth, tenant, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      organizationId: req.user.organizationId
    });

    return res.json({ totalUsers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
