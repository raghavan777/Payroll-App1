const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "EMPLOYEE" },
  permissions: [String],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },

  // For Part B
  lastLoginAt: Date,
  lastLoginIP: String,
  lastLoginUA: String,

  // For Part C
  mfaEnabled: { type: Boolean, default: false },
  mfaCode: String,
  mfaExpires: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
