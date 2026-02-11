const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
        action: { type: String, required: true }, // e.g., "PAYROLL_APPROVED", "STATUTORY_UPDATED"
        module: { type: String, required: true }, // e.g., "PAYROLL", "STATUTORY", "TAX"
        details: { type: mongoose.Schema.Types.Mixed }, // Arbitrary JSON data
        ipAddress: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
