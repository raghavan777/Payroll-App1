const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { getAuditLogs } = require("../controllers/auditController");

// 🔹 GET audit logs (SUPER_ADMIN only)
router.get("/", auth, role(["SUPER_ADMIN"]), getAuditLogs);

module.exports = router;
