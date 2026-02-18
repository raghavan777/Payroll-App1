const StatutoryConfig = require("../models/StatutoryConfig");
const TaxSlab = require("../models/TaxSlab"); // Added TaxSlab model
const { logAction } = require("./auditController");

// --- STATUTORY CONFIGS ---

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
    const { country, state } = req.body;

    // Check for existing configuration
    const existing = await StatutoryConfig.findOne({ country, state });
    if (existing) {
      return res.status(400).json({ message: `Configuration for ${country}/${state} already exists.` });
    }

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

    res.status(201).json({ message: "Statutory parameters synchronized", config });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to save configuration" });
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

// --- TAX SLABS (LEGACY SUPPORT) ---

// GET /api/statutory/tax-slab
exports.getTaxSlabs = async (req, res) => {
  try {
    const slabs = await TaxSlab.find({
      // For legacy components, we return all or could filter by country/state if sent in query
      country: req.query.country,
      state: req.query.state
    });
    res.json(slabs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/statutory/tax-slab
exports.addTaxSlab = async (req, res) => {
  try {
    const { country, state, minIncome, maxIncome, taxPercentage } = req.body;

    // Check if a slab with the same parameters already exists
    const existing = await TaxSlab.findOne({
      country,
      state,
      minIncome,
      maxIncome,
      regime: "old",
      financialYear: "LEGACY"
    });

    if (existing) {
      return res.status(400).json({
        message: "Failed to add regulatory slab",
        error: "A tax slab with these parameters already exists"
      });
    }

    // Legacy mapping: frontend sends country, state, minIncome, maxIncome, taxPercentage
    // We store it in TaxSlab model which has these fields for backward compatibility
    const slab = new TaxSlab({
      ...req.body,
      regime: "old", // Default to old for legacy
      financialYear: "LEGACY", // Marker for legacy data
    });

    await slab.save();

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "TAX_SLAB_CREATED",
      module: "STATUTORY",
      details: req.body,
      req
    });

    res.status(201).json({ message: "Tax slab saved successfully", slab });
  } catch (err) {
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Failed to add regulatory slab",
        error: "A tax slab with this regime and financial year combination already exists"
      });
    }
    res.status(500).json({
      message: "Failed to add regulatory slab",
      error: err.message
    });
  }
};
