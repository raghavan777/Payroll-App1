const mongoose = require("mongoose");

const proofFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const taxDeclarationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    financialYear: {
      type: String,
      required: true,
      trim: true,
    },
    selectedRegime: {
      type: String,
      enum: ["old", "new"],
      required: true,
      lowercase: true,
      trim: true,
    },
    totalIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    investments: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxableIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    calculatedTax: {
      type: Number,
      required: true,
      min: 0,
    },
    proofFiles: {
      type: [proofFileSchema],
      default: [],
    },
  },
  { timestamps: true }
);

taxDeclarationSchema.index({ employeeId: 1, financialYear: 1 }, { unique: true });

module.exports =
  mongoose.models.TaxDeclaration ||
  mongoose.model("TaxDeclaration", taxDeclarationSchema);
