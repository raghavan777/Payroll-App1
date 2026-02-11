const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true },
    date: { type: Date, required: true },
    leaveType: { type: String, required: true },
    isPaid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
