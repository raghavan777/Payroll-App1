const Attendance = require("../models/Attendance");

/**
 * GET attendance by employee
 */
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const attendance = await Attendance.find({ employeeCode }).sort({
      date: 1,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CREATE attendance (Admin)
 */
exports.createAttendance = async (req, res) => {
  try {
    const { employeeCode, date, status, hoursWorked } = req.body;

    const record = await Attendance.create({
      employeeCode,
      date,
      status,
      hoursWorked,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
