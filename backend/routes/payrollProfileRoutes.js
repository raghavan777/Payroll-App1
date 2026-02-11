const express = require("express");
const router = express.Router();
const controller = require("../controllers/payrollProfileController");
const { protect, authorizeHR } = require("../middleware/authMiddleware");

/**
 * CREATE Payroll Profile
 */
router.post(
  "/",
  protect,
  authorizeHR,
  controller.createPayrollProfile
);

/**
 * GET All Payroll Profiles
 */
router.get(
  "/",
  protect,
  authorizeHR,
  controller.getAllPayrollProfiles
);

/**
 * GET Payroll Profile by employeeCode
 */
router.get(
  "/:employeeCode",
  protect,
  authorizeHR,
  controller.getPayrollProfile
);

/**
 * UPDATE Payroll Profile by employeeCode
 */
router.put(
  "/:employeeCode",
  protect,
  authorizeHR,
  controller.updatePayrollProfile
);

/**
 * ASSIGN Salary Template by employeeCode
 */
router.post(
  "/:employeeCode/assign-template",
  protect,
  authorizeHR,
  controller.assignSalaryTemplate
);

/**
 * DELETE Payroll Profile by employeeCode
 */
router.delete(
  "/:employeeCode",
  protect,
  authorizeHR,
  controller.deletePayrollProfile
);

module.exports = router;
