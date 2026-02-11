const Organization = require("../models/Organization");

module.exports = async function (req, res, next) {
  try {
    const org = await Organization.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: "Organization not found" });
    req.organization = org;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
