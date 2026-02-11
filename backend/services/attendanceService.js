const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

/**
 * Fetch attendance records for a payroll period
 */
exports.getAttendance = async (employeeCode, startDate, endDate) => {
  return Attendance.find({
    employeeCode,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });
};

/**
 * Calculate Loss of Pay (LOP)
 * Converts attendance + unpaid leave into monetary deduction
 */
exports.calculateLOP = async (
  employeeCode,
  attendanceRecords,
  startDate,
  endDate,
  dailySalary
) => {
  let lopDays = 0;

  // Attendance-based LOP
  attendanceRecords.forEach((record) => {
    switch (record.status) {
      case "ABSENT":
        lopDays += 1;
        break;
      case "HALF_DAY":
        lopDays += 0.5;
        break;
      default:
        break;
    }
  });

  // Unpaid leave-based LOP
  const unpaidLeaves = await Leave.find({
    employeeCode,
    isPaid: false,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  lopDays += unpaidLeaves.length;

  return {
    lopDays,
    lopAmount: Number((lopDays * dailySalary).toFixed(2)),
  };
};
