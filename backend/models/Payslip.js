const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    payrollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
      required: true,
      unique: true, // Prevent duplicate payslip generation for the same payroll
      index: true,
    },
    earnings: {
      type: Map,
      of: Number,
      default: {},
    },
    deductions: {
      type: Map,
      of: Number,
      default: {},
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    payPeriod: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payslip", payslipSchema);
