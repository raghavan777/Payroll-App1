const mongoose = require("mongoose");

const PayrollProfileSchema = new mongoose.Schema(
  {
    // 🔥 MongoDB reference to Employee
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true
    },

    // 🔥 Business employee code (EMP-2026-0003)
    employeeCode: {
      type: String,
      required: true,
      unique: true
    },

    salaryStructure: {
      basic: { type: Number, required: true },
      hra: { type: Number, required: true },
      allowances: { type: Number, required: true }
    },

    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifsc: String
    },

    taxRegime: {
      type: String,
      enum: ["Old", "New"],
      default: "Old"
    },

    salaryTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryTemplate"
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayrollProfile", PayrollProfileSchema);
