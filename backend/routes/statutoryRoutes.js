const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const { addTaxSlab } = require("../controllers/taxController");
const { addStatutoryConfig } = require("../controllers/statutoryController");
const { calculatePayroll } = require("../controllers/payrollController");

// 🔹 Add Tax Slab (SUPER_ADMIN only)
router.post("/tax-slab", auth, role(["SUPER_ADMIN"]), addTaxSlab);

// 🔹 Add Statutory Config (SUPER_ADMIN only)
router.post("/statutory", auth, role(["SUPER_ADMIN"]), addStatutoryConfig);

// 🔹 Run Payroll (NO ROLE VALIDATION — employee/admin allowed)
router.post("/payroll", auth, calculatePayroll);

module.exports = router;
