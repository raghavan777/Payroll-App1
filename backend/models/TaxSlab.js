const mongoose = require("mongoose");

const taxSlabSchema = new mongoose.Schema({
  regime: {
    type: String,
    enum: ["old", "new"],
    required: true,
    lowercase: true,
    trim: true,
  },
  slabs: [
    {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, default: null },
      rate: { type: Number, required: true, min: 0, max: 100 },
    },
  ],
  financialYear: {
    type: String,
    required: true,
    trim: true,
  },

  // Legacy fields retained for backward compatibility with existing modules.
  country: { type: String },
  state: { type: String },
  minIncome: { type: Number },
  maxIncome: { type: Number },
  taxPercentage: { type: Number },
}, { timestamps: true });

taxSlabSchema.index({ regime: 1, financialYear: 1 }, { unique: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.TaxSlab || mongoose.model("TaxSlab", taxSlabSchema);
