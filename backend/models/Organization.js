const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  name: String,
  country: String,
  domain: { type: String, unique: true },
  status: { type: String, default: "pending" }, // pending | active | suspended
  logoUrl: String,
  address: String,
  timezone: { type: String, default: "Asia/Kolkata" },
  currency: { type: String, default: "INR" },
  locale: { type: String, default: "en-IN" },
  weekOff: { type: [String], default: ["Saturday", "Sunday"] },
  verificationToken: String,
  verifiedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Organization", orgSchema);
