const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const rolesConfig = require("../config/roles");
const validatePassword = require("../utils/passwordPolicy");
const sendEmail = require("../utils/sendEmail");
const permissionsConfig = require("../config/permissions");

/**
 * REGISTER ORGANIZATION (SUPER_ADMIN)
 */
exports.registerOrg = async (req, res) => {
  try {
    const { orgName, country, domain, adminName, adminEmail, password } = req.body;
    const DEV_MODE = process.env.DEV_MODE === "true";

    // 🔹 Prevent duplicate domains (except DEV)
    const existingOrg = await Organization.findOne({ domain });
    if (!DEV_MODE && existingOrg) {
      return res.status(400).json({ message: "This domain is already registered" });
    }

    // 🔹 Enforce password policy
    const passError = validatePassword(password);
    if (passError) {
      return res.status(400).json({ message: passError });
    }

    // 🔹 Create organization
    const org = await Organization.create({
      name: orgName,
      country,
      domain,
      status: "active",
      verifiedAt: new Date()
    });

    // 🔹 Hash admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create SUPER_ADMIN user
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      permissions: rolesConfig["SUPER_ADMIN"],
      organizationId: org._id
    });

    return res.status(201).json({
      message: "Organization registered successfully",
      note: DEV_MODE ? "DEV_MODE enabled. Email verification skipped." : null
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN (CRITICAL FIX APPLIED ✅)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const DEV_MODE = process.env.DEV_MODE === "true";

    // 🔹 Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    // 🔹 Check organization status
    const org = await Organization.findById(user.organizationId);
    if (!DEV_MODE && org.status !== "active") {
      return res.status(403).json({ message: "Organization inactive" });
    }

    // 🔹 Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid login" });
    }

    // ✅ FIX 1: Assign permissions based on role
    const userPermissions = permissionsConfig[user.role] || [];

    console.log("LOGIN ROLE:", user.role);
    console.log("LOGIN PERMISSIONS:", userPermissions);

    // ✅ FIX 2: Put correct permissions & organizationId into JWT
    let employeeCode = null;

    // 🔹 FIX: Always try to fetch employeeCode if it exists (for HR, Admin, etc.)
    // This allows HR/Admins to also access "My Payroll History"
    const Employee = require("../models/Employee");
    const emp = await Employee.findOne({ userId: user._id });
    if (emp) {
      employeeCode = emp.employeeCode;
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        permissions: userPermissions,
        organizationId: user.organizationId,
        employeeCode // <--- ADDED THIS
      },
      process.env.JWT_SECRET,
      { expiresIn: "200d" }
    );

    return res.json({ accessToken });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * MFA - SEND OTP
 */
exports.requestMFA = async (req, res) => {
  const user = req.user;

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.mfaCode = code;
  user.mfaExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();
  await sendEmail(user.email, `Your verification code is ${code}`);

  return res.json({ message: "MFA code sent to email" });
};

/**
 * MFA - VERIFY OTP
 */
exports.verifyMFA = async (req, res) => {
  const { code } = req.body;
  const user = req.user;

  if (!user.mfaCode || user.mfaExpires < new Date()) {
    return res.status(400).json({ message: "Code expired or invalid" });
  }

  if (user.mfaCode !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  user.mfaCode = null;
  user.mfaExpires = null;
  await user.save();

  return res.json({ message: "MFA verified" });
};
