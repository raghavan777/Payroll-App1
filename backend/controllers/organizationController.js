const Organization = require("../models/Organization");
const { logAction } = require("./auditController");

// GET /api/organization
exports.getOrgDetails = async (req, res) => {
    try {
        const org = await Organization.findById(req.user.organizationId);
        if (!org) return res.status(404).json({ message: "Organization not found" });
        res.json(org);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch organization details" });
    }
};

// PUT /api/organization
exports.updateOrgDetails = async (req, res) => {
    try {
        const org = await Organization.findByIdAndUpdate(
            req.user.organizationId,
            req.body,
            { new: true }
        );

        await logAction({
            userId: req.user.userId,
            organizationId: req.user.organizationId,
            action: "ORGANIZATION_UPDATED",
            module: "ORGANIZATION",
            details: req.body,
            req
        });

        res.json({ message: "Organization updated successfully", org });
    } catch (err) {
        res.status(500).json({ message: "Failed to update organization" });
    }
};
