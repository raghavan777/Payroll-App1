const StatutoryConfig = require("../models/StatutoryConfig");
const { logAction } = require("./auditController");

// GET /api/statutory
exports.getStatutoryConfigs = async (req, res) => {
  try {
    const configs = await StatutoryConfig.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/statutory
exports.addStatutoryConfig = async (req, res) => {
  try {
    const config = new StatutoryConfig(req.body);
    await config.save();

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "STATUTORY_CREATED",
      module: "STATUTORY",
      details: req.body,
      req
    });

    res.status(201).json({ message: "Statutory config saved", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/statutory/:id
exports.updateStatutoryConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await StatutoryConfig.findByIdAndUpdate(id, req.body, { new: true });
    if (!config) return res.status(404).json({ message: "Config not found" });

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "STATUTORY_UPDATED",
      module: "STATUTORY",
      details: { id, ...req.body },
      req
    });

    res.json({ message: "Statutory config updated", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/statutory/:id
exports.deleteStatutoryConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await StatutoryConfig.findByIdAndDelete(id);
    if (!config) return res.status(404).json({ message: "Config not found" });
    res.json({ message: "Statutory config deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
