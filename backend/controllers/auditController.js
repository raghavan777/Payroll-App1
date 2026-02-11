const AuditLog = require("../models/AuditLog");

// Internal helper to create logs (can be exported or used in a middleware)
exports.logAction = async ({ userId, organizationId, action, module, details, req }) => {
    try {
        await AuditLog.create({
            userId,
            organizationId,
            action,
            module,
            details,
            ipAddress: req ? (req.headers["x-forwarded-for"] || req.socket.remoteAddress) : null,
        });
    } catch (err) {
        console.error("AUDIT LOG ERROR:", err);
    }
};

// GET /api/audit (SUPER_ADMIN)
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({ organizationId: req.user.organizationId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch audit logs" });
    }
};
