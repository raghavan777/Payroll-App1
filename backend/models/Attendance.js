const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "HALF_DAY"],
      required: true,
    },
    hoursWorked: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
