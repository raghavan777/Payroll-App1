const mongoose = require("mongoose");

const salaryTemplateSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },

  name: { type: String, required: true },

  // Earnings Split
  basicPercent: { type: Number, required: true },
  hraPercent: { type: Number, required: true },
  allowancePercent: { type: Number, required: true },

  // Deductions Split
  pfPercent: { type: Number, required: true },
  esiPercent: { type: Number, required: true },
  taxPercent: { type: Number, required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.SalaryTemplate || mongoose.model("SalaryTemplate", salaryTemplateSchema);
