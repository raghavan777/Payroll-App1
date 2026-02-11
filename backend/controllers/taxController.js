const TaxSlab = require("../models/TaxSlab");

exports.addTaxSlab = async (req, res) => {
  try {
    let { country, state, minIncome, maxIncome, taxPercentage } = req.body;

    // Convert to numbers
    minIncome = Number(minIncome);
    maxIncome = Number(maxIncome);
    taxPercentage = Number(taxPercentage);

    if (isNaN(minIncome) || isNaN(maxIncome) || isNaN(taxPercentage)) {
      return res.status(400).json({ message: "Income and tax fields must be numbers" });
    }

    if (minIncome >= maxIncome) {
      return res.status(400).json({ message: "Minimum income must be less than maximum income" });
    }

    if (taxPercentage < 0 || taxPercentage > 100) {
      return res.status(400).json({ message: "Tax percentage must be between 0 and 100" });
    }

    // Prevent overlapping slabs
    const overlap = await TaxSlab.findOne({
      country,
      state,
      $or: [
        { minIncome: { $lte: maxIncome, $gte: minIncome } },
        { maxIncome: { $lte: maxIncome, $gte: minIncome } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ message: "Tax slab overlaps with an existing slab" });
    }

    const slab = new TaxSlab({
      country,
      state,
      minIncome,
      maxIncome,
      taxPercentage
    });

    await slab.save();

    return res.status(201).json({ message: "Tax slab added successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
