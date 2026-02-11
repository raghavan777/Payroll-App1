const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Auto-generated unique Employee ID (EMP-YYYY-XXXX)
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      immutable: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Basic employee details
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    department: {
      type: String,
      required: true
    },

    designation: {
      type: String,
      required: true
    },

    dateOfJoining: {
      type: Date,
      required: true
    },

    // Organization reference (derived from logged-in user)
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    // Status for future use (active/inactive)
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

// Index for fast lookups by employeeCode - REMOVED DUPLICATE
// employeeCode is already indexed via unique: true in schema

module.exports = mongoose.model("Employee", employeeSchema);
