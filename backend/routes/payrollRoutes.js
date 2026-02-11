const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkPermission = require("../middleware/permission");

const {
  payrollPreview,
  calculatePayroll,
  approvePayroll,
  getMyPayrollHistory,
  getPayrollHistory,
} = require("../controllers/payrollController");

/* =====================================================
   PAYROLL ROUTES (FINAL – CORRECT)
===================================================== */

/**
 * 🔹 Payroll Preview (HR / Payroll Admin)
 */
router.get(
  "/preview",
  auth,
  checkPermission("run_payroll"),
  payrollPreview
);

/**
 * 🔹 Run Payroll
 */
router.post(
  "/run",
  auth,
  checkPermission("run_payroll"),
  calculatePayroll
);

/**
 * 🔹 Approve Payroll
 */
router.post(
  "/approve",
  auth,
  checkPermission("approve_payroll"),
  approvePayroll
);

/**
 * 🔹 Payroll History (ADMIN / HR)
 */
router.get(
  "/history",
  auth,
  checkPermission("view_reports"),
  getPayrollHistory
);

/**
 * 🔹 Payroll History (EMPLOYEE – SELF)
 */
router.get(
  "/history/me",
  auth,
  getMyPayrollHistory
);

module.exports = router;
