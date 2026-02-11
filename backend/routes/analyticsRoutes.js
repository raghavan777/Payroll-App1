const router = require("express").Router();
const protect = require("../middleware/auth");

/* IMPORT CONTROLLER FUNCTIONS */
const {
    getAnalyticsSummary,
    getPayrollTrend,
} = require("../controllers/analyticsController");

/* ================= ROUTES ================= */

router.get("/summary", protect, getAnalyticsSummary);
router.get("/trend", protect, getPayrollTrend);

module.exports = router;
