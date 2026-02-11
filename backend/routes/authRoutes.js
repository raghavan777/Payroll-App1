const express = require("express");
const router = express.Router();

const {
  login,
  registerOrg,
  requestMFA,
  verifyMFA
} = require("../controllers/authController");

const auth = require("../middleware/auth");
const tenant = require("../middleware/tenant");
const User = require("../models/User");

/**
 * Get Logged-In User Profile
 * Protected Route
 */
router.get("/profile", auth, (req, res) => {
  res.json(req.user);
});

/**
 * AUTH ROUTES
 */

// SUPER ADMIN – ORGANIZATION REGISTRATION
router.post("/register-org", registerOrg);

// LOGIN
router.post("/login", login);

/**
 * MFA ROUTES
 */
router.post("/mfa/request", auth, requestMFA);
router.post("/mfa/verify", auth, verifyMFA);

/**
 * Fetch Users Under Same Organization
 * Protected + Tenant-aware
 */
router.get("/users", auth, tenant, async (req, res) => {
  try {
    const users = await User.find({
      organizationId: req.user.organizationId
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
