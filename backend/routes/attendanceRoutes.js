const express = require("express");
const router = express.Router();
const {
    getAttendanceByEmployee,
    createAttendance,
} = require("../controllers/attendanceController");
const { protect, authorizeHR } = require("../middleware/authMiddleware");

router.get("/:employeeCode", protect, getAttendanceByEmployee);

// Admin only
router.post("/", protect, authorizeHR, createAttendance);

module.exports = router;
