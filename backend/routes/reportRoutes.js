const express = require("express");
const router = express.Router();
const { protect, authorizeHR } = require("../middleware/authMiddleware");
const { getPayrollSummary } = require("../controllers/reportController");

router.get("/payroll-summary", protect, authorizeHR, getPayrollSummary);

module.exports = router;
