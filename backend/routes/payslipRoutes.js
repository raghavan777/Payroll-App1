const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  generatePayslip,
  getPayslipById,
} = require("../controllers/payslipController");

// Generate payslip from an approved payroll record.
router.post("/generate", auth, generatePayslip);

// View/download payslip PDF. Use ?mode=url to return only URL.
router.get("/:id", auth, getPayslipById);

module.exports = router;
