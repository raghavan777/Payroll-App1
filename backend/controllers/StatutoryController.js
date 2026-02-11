const StatutoryConfig = require("../models/StatutoryConfig");

exports.addStatutoryConfig = async (req, res) => {
  try {
    const config = new StatutoryConfig(req.body);
    await config.save();
    res.status(201).json({ message: "Statutory config saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
