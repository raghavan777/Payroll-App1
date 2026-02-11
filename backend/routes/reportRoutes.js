const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { getPayrollSummary, getStatutoryReports, getBankAdvice } = require("../controllers/reportController");

router.get("/payroll-summary", auth, role(["SUPER_ADMIN", "HR_ADMIN"]), getPayrollSummary);
router.get("/statutory", auth, role(["SUPER_ADMIN", "HR_ADMIN"]), getStatutoryReports);
router.get("/bank-advice", auth, role(["SUPER_ADMIN", "HR_ADMIN"]), getBankAdvice);

module.exports = router;
