const express = require("express");
const router = express.Router();

const {
  previewPayroll,
  approvePayroll,
  lockPayroll,
} = require("../controllers/payrollRunController");

/**
 * ===============================
 * MODULE 6: PAYROLL PROCESSING
 * ===============================
 */

// 🔹 Preview monthly payroll (no DB save)
router.post("/preview", previewPayroll);

// 🔹 Approve payroll (save payroll records)
router.post("/approve", approvePayroll);

// 🔹 Lock payroll (no further changes allowed)
router.post("/lock", lockPayroll);

module.exports = router;
