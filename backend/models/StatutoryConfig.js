const mongoose = require("mongoose");

const statutoryConfigSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      trim: true
    },

    pfPercentage: {
      type: Number,
      default: 0
    },

    esiPercentage: {
      type: Number,
      default: 0
    },

    professionalTax: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate configurations for the same location
statutoryConfigSchema.index({ country: 1, state: 1 }, { unique: true });

// Prevent OverwriteModelError
module.exports =
  mongoose.models.StatutoryConfig ||
  mongoose.model("StatutoryConfig", statutoryConfigSchema);
