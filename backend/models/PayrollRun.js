// models/PayrollRun.js
const mongoose = require("mongoose");

const payrollRunSchema = new mongoose.Schema({
  month: String,
  year: Number,
  status: {
    type: String,
    enum: ["DRAFT", "APPROVED", "LOCKED"],
    default: "DRAFT",
  },
  generatedAt: Date,
});

module.exports = mongoose.model("PayrollRun", payrollRunSchema);
