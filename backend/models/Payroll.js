const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
  },

  periodStart: Date,
  periodEnd: Date,

  basic: Number,
  hra: Number,
  allowances: Number,

  workedDays: {
    type: Number,
    default: 0,
  },
  lopDays: {
    type: Number,
    default: 0,
  },

  grossSalary: Number,
  netSalary: Number,

  // Statutory & Tax Details
  pf: { type: Number, default: 0 },
  esi: { type: Number, default: 0 },
  professionalTax: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },

  // Attendance related
  overtimeHours: { type: Number, default: 0 },
  overtimePay: { type: Number, default: 0 },
  lopAmount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED"], // ✅ MUST MATCH CONTROLLER
    default: "PENDING",
  },

  approvedAt: Date,
  approvedBy: String,

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
