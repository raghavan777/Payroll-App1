const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Organization = require("../models/Organization");
const { sendInviteEmail } = require("../utils/email");

/**
 * ADMIN INVITES A USER
 */
exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const admin = req.user; // comes from JWT via auth middleware

    // Basic validation
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    // Check if admin's org exists
    const org = await Organization.findById(admin.organizationId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Validate domain match
    const emailDomain = email.split("@")[1];
    if (!emailDomain) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (emailDomain.toLowerCase() !== org.domain.toLowerCase()) {
      return res.status(400).json({ message: "Email domain must match organization domain" });
    }

    // Prevent duplicate invitations
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isOnboarded) {
      return res.status(400).json({ message: "User already exists in the organization" });
    }

    // Create invite token
    const token = crypto.randomBytes(32).toString("hex");

    // If user exists but not onboarded — update invite
    if (existingUser) {
      existingUser.inviteToken = token;
      existingUser.inviteExpires = Date.now() + 24 * 60 * 60 * 1000;
      await existingUser.save();
    } else {
      // Create a new invited user placeholder
      await User.create({
        email,
        role,
        organizationId: admin.organizationId,
        inviteToken: token,
        inviteExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        isOnboarded: false
      });
    }

    // Send invite email
    await sendInviteEmail(email, token);

    return res.json({ message: "Invite sent successfully!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * USER ACCEPTS INVITE (SETUP ACCOUNT)
 */
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    // Validate token exists
    const user = await User.findOne({ inviteToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite link" });
    }

    // Check expiration
    if (user.inviteExpires < Date.now()) {
      return res.status(400).json({ message: "Invite has expired, request a new one" });
    }

    // Validate setup fields
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Complete onboarding
    user.name = name;
    user.password = hashedPassword;
    user.inviteToken = undefined;
    user.inviteExpires = undefined;
    user.isOnboarded = true;
    user.isEmailVerified = true; // OPTIONAL: mark email verified once accepted
    await user.save();

    return res.json({ message: "Account setup completed. You may now login." });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
