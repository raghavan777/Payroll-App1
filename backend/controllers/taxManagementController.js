const PDFDocument = require("pdfkit");

const Employee = require("../models/Employee");
const PayrollProfile = require("../models/PayrollProfile");
const TaxSlab = require("../models/TaxSlab");
const TaxDeclaration = require("../models/TaxDeclaration");

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getCurrentFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Jan = 1
  if (month >= 4) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
};

const normalizeRegime = (value = "old") => String(value).toLowerCase().trim();

const sanitizeFinancialYear = (value) => String(value || "").trim();

const validateSlabs = (slabs = []) => {
  if (!Array.isArray(slabs) || slabs.length === 0) {
    return "At least one slab is required";
  }

  for (let i = 0; i < slabs.length; i += 1) {
    const slab = slabs[i];
    const min = toNumber(slab.min);
    const max = slab.max === null || slab.max === undefined ? null : toNumber(slab.max);
    const rate = toNumber(slab.rate);

    if (min < 0) return `Invalid min at slab index ${i}`;
    if (max !== null && max <= min) return `max must be greater than min at slab index ${i}`;
    if (rate < 0 || rate > 100) return `rate must be between 0 and 100 at slab index ${i}`;
  }

  return null;
};

// Progressive slab taxation: each bracket only applies to the bracket portion.
const calculateTaxBySlabs = (taxableIncome, slabs) => {
  let tax = 0;
  const income = Math.max(0, toNumber(taxableIncome));
  const sortedSlabs = [...slabs].sort((a, b) => toNumber(a.min) - toNumber(b.min));

  sortedSlabs.forEach((slab) => {
    const min = toNumber(slab.min);
    const max = slab.max === null || slab.max === undefined ? Number.POSITIVE_INFINITY : toNumber(slab.max);
    const rate = toNumber(slab.rate);

    if (income <= min) return;

    const taxablePortion = Math.min(income, max) - min;
    if (taxablePortion > 0) {
      tax += (taxablePortion * rate) / 100;
    }
  });

  return Number(tax.toFixed(2));
};

const getEmployeeFromToken = async (req) => {
  // Primary lookup: employee linked to logged-in user.
  let employee = await Employee.findOne({
    userId: req.user.userId,
    organizationId: req.user.organizationId,
  });

  // Fallback lookup: token may carry employeeCode.
  if (!employee && req.user.employeeCode) {
    employee = await Employee.findOne({
      employeeCode: req.user.employeeCode,
      organizationId: req.user.organizationId,
    });
  }

  return employee;
};

// POST /api/tax/slabs (SUPER_ADMIN)
exports.createOrUpdateTaxSlabs = async (req, res) => {
  try {
    const { regime, slabs, financialYear } = req.body;
    const normalizedRegime = normalizeRegime(regime);
    const fy = sanitizeFinancialYear(financialYear);

    if (!["old", "new"].includes(normalizedRegime)) {
      return res.status(400).json({ message: "regime must be 'old' or 'new'" });
    }
    if (!fy) {
      return res.status(400).json({ message: "financialYear is required" });
    }

    const slabError = validateSlabs(slabs);
    if (slabError) return res.status(400).json({ message: slabError });

    const normalizedSlabs = slabs.map((s) => ({
      min: toNumber(s.min),
      max: s.max === null || s.max === undefined ? null : toNumber(s.max),
      rate: toNumber(s.rate),
    }));

    const taxSlab = await TaxSlab.findOneAndUpdate(
      { regime: normalizedRegime, financialYear: fy },
      { regime: normalizedRegime, financialYear: fy, slabs: normalizedSlabs },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Tax slabs saved successfully",
      taxSlab,
    });
  } catch (error) {
    console.error("CREATE/UPDATE TAX SLAB ERROR:", error);
    return res.status(500).json({ message: "Failed to save tax slabs" });
  }
};

// GET /api/tax/declarations (SUPER_ADMIN)
exports.listTaxDeclarations = async (req, res) => {
  try {
    const employees = await Employee.find(
      { organizationId: req.user.organizationId },
      { _id: 1 }
    ).lean();

    const employeeIds = employees.map((e) => e._id);
    const declarations = await TaxDeclaration.find({ employeeId: { $in: employeeIds } })
      .populate("employeeId", "name email employeeCode")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(declarations);
  } catch (error) {
    console.error("LIST TAX DECLARATIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch tax declarations" });
  }
};

// POST /api/tax/declarations (SUPER_ADMIN)
exports.createTaxDeclaration = async (req, res) => {
  try {
    const {
      employeeId,
      financialYear,
      selectedRegime,
      totalIncome,
      investments = 0,
    } = req.body;
    const fy = sanitizeFinancialYear(financialYear);

    if (!employeeId || !fy || !selectedRegime || totalIncome === undefined) {
      return res.status(400).json({
        message: "employeeId, financialYear, selectedRegime and totalIncome are required",
      });
    }

    const employee = await Employee.findOne({
      employeeCode: employeeId,
      organizationId: req.user.organizationId,
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const regime = normalizeRegime(selectedRegime);
    if (!["old", "new"].includes(regime)) {
      return res.status(400).json({ message: "selectedRegime must be 'old' or 'new'" });
    }

    const slabDoc = await TaxSlab.findOne({ regime, financialYear: fy }).lean();
    if (!slabDoc) {
      return res.status(404).json({ message: "Tax slabs not found for selected regime/year" });
    }

    const normalizedTotalIncome = Math.max(0, toNumber(totalIncome));
    const normalizedInvestments = Math.max(0, toNumber(investments));
    const taxableIncome = Math.max(0, normalizedTotalIncome - normalizedInvestments);
    const calculatedTax = calculateTaxBySlabs(taxableIncome, slabDoc.slabs || []);

    const proofFiles =
      (req.files || []).map((file) => ({
        filename: file.originalname,
        fileUrl: `/uploads/tax/${file.filename}`,
      })) || [];

    const declaration = await TaxDeclaration.findOneAndUpdate(
      { employeeId: employee._id, financialYear: fy },
      {
        employeeId: employee._id,
        financialYear: fy,
        selectedRegime: regime,
        totalIncome: normalizedTotalIncome,
        investments: normalizedInvestments,
        taxableIncome,
        calculatedTax,
        proofFiles,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      message: "Tax declaration saved successfully",
      declaration,
    });
  } catch (error) {
    console.error("CREATE TAX DECLARATION ERROR:", error);
    return res.status(500).json({ message: "Failed to create tax declaration" });
  }
};

// PUT /api/tax/declarations/:id (SUPER_ADMIN)
exports.updateTaxDeclaration = async (req, res) => {
  try {
    const { id } = req.params;
    const declaration = await TaxDeclaration.findById(id);
    if (!declaration) {
      return res.status(404).json({ message: "Tax declaration not found" });
    }

    const employee = await Employee.findOne({
      _id: declaration.employeeId,
      organizationId: req.user.organizationId,
    }).lean();
    if (!employee) {
      return res.status(403).json({ message: "Access denied" });
    }

    const selectedRegime = req.body.selectedRegime
      ? normalizeRegime(req.body.selectedRegime)
      : declaration.selectedRegime;
    const financialYear = sanitizeFinancialYear(req.body.financialYear) || declaration.financialYear;

    const slabDoc = await TaxSlab.findOne({
      regime: selectedRegime,
      financialYear,
    }).lean();
    if (!slabDoc) {
      return res.status(404).json({ message: "Tax slabs not found for selected regime/year" });
    }

    const totalIncome =
      req.body.totalIncome !== undefined
        ? Math.max(0, toNumber(req.body.totalIncome))
        : declaration.totalIncome;
    const investments =
      req.body.investments !== undefined
        ? Math.max(0, toNumber(req.body.investments))
        : declaration.investments;

    const taxableIncome = Math.max(0, totalIncome - investments);
    const calculatedTax = calculateTaxBySlabs(taxableIncome, slabDoc.slabs || []);

    declaration.financialYear = financialYear;
    declaration.selectedRegime = selectedRegime;
    declaration.totalIncome = totalIncome;
    declaration.investments = investments;
    declaration.taxableIncome = taxableIncome;
    declaration.calculatedTax = calculatedTax;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const newFiles = req.files.map((file) => ({
        filename: file.originalname,
        fileUrl: `/uploads/tax/${file.filename}`,
      }));
      declaration.proofFiles = [...declaration.proofFiles, ...newFiles];
    }

    await declaration.save();

    return res.status(200).json({
      message: "Tax declaration updated successfully",
      declaration,
    });
  } catch (error) {
    console.error("UPDATE TAX DECLARATION ERROR:", error);
    return res.status(500).json({ message: "Failed to update tax declaration" });
  }
};

// GET /api/tax/my-declaration (EMPLOYEE)
exports.getMyDeclaration = async (req, res) => {
  try {
    const employee = await getEmployeeFromToken(req);
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const financialYear = sanitizeFinancialYear(req.query.financialYear);
    const query = { employeeId: employee._id };
    if (financialYear) query.financialYear = financialYear;

    const declaration = await TaxDeclaration.findOne(query)
      .sort({ createdAt: -1 })
      .lean();

    if (!declaration) {
      return res.status(404).json({ message: "Tax declaration not found" });
    }

    return res.status(200).json(declaration);
  } catch (error) {
    console.error("GET MY DECLARATION ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch tax declaration" });
  }
};

// GET /api/tax/projection (EMPLOYEE)
exports.getTaxProjection = async (req, res) => {
  try {
    const employee = await getEmployeeFromToken(req);
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const profile = await PayrollProfile.findOne({
      employeeCode: employee.employeeCode,
      organizationId: req.user.organizationId,
    }).lean();

    if (!profile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    const monthlyIncome =
      toNumber(profile.salaryStructure?.basic) +
      toNumber(profile.salaryStructure?.hra) +
      toNumber(profile.salaryStructure?.allowances);

    const totalIncome = Number((monthlyIncome * 12).toFixed(2));
    const financialYear = sanitizeFinancialYear(req.query.financialYear) || getCurrentFinancialYear();
    const selectedRegime = normalizeRegime(
      req.query.regime || profile.taxRegime || "old"
    );

    const declaration = await TaxDeclaration.findOne({
      employeeId: employee._id,
      financialYear,
    }).lean();

    const investments = declaration ? toNumber(declaration.investments) : 0;
    const taxableIncome = Math.max(0, totalIncome - investments);

    const slabDoc = await TaxSlab.findOne({
      regime: selectedRegime,
      financialYear,
    }).lean();
    if (!slabDoc) {
      return res.status(404).json({
        message: "Tax slabs not found for selected regime/financial year",
      });
    }

    const projectedTax = calculateTaxBySlabs(taxableIncome, slabDoc.slabs || []);

    return res.status(200).json({
      employeeId: employee._id,
      employeeCode: employee.employeeCode,
      financialYear,
      selectedRegime,
      totalIncome,
      investments,
      taxableIncome,
      projectedTax,
    });
  } catch (error) {
    console.error("GET TAX PROJECTION ERROR:", error);
    return res.status(500).json({ message: "Failed to calculate projected tax" });
  }
};

// GET /api/tax/download/:id (EMPLOYEE)
exports.downloadTaxStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const declaration = await TaxDeclaration.findById(id)
      .populate("employeeId")
      .lean();

    if (!declaration) {
      return res.status(404).json({ message: "Tax declaration not found" });
    }

    const employee = await getEmployeeFromToken(req);
    if (!employee || String(employee._id) !== String(declaration.employeeId?._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const pdfFileName = `tax-statement-${employee.employeeCode}-${declaration.financialYear}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdfFileName}"`);

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    doc.fontSize(20).text("Tax Statement", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Employee: ${declaration.employeeId?.name || "-"}`);
    doc.text(`Employee Code: ${declaration.employeeId?.employeeCode || "-"}`);
    doc.text(`Financial Year: ${declaration.financialYear}`);
    doc.text(`Regime: ${declaration.selectedRegime.toUpperCase()}`);
    doc.moveDown();

    doc.fontSize(13).text("Tax Summary");
    doc.fontSize(11).text(`Total Income: ${toNumber(declaration.totalIncome).toFixed(2)}`);
    doc.fontSize(11).text(`Investments: ${toNumber(declaration.investments).toFixed(2)}`);
    doc.fontSize(11).text(`Taxable Income: ${toNumber(declaration.taxableIncome).toFixed(2)}`);
    doc
      .fontSize(12)
      .text(`Calculated Tax: ${toNumber(declaration.calculatedTax).toFixed(2)}`, {
        underline: true,
      });
    doc.moveDown();

    doc.fontSize(13).text("Uploaded Proofs");
    if (!declaration.proofFiles || declaration.proofFiles.length === 0) {
      doc.fontSize(11).text("No proofs uploaded");
    } else {
      declaration.proofFiles.forEach((file, idx) => {
        doc.fontSize(11).text(`${idx + 1}. ${file.filename}`);
      });
    }

    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated on ${new Date().toLocaleString()}`);
    doc.fillColor("black");

    doc.end();
  } catch (error) {
    console.error("DOWNLOAD TAX STATEMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to download tax statement" });
  }
};

// Exposed for unit testing and reuse.
exports._helpers = {
  calculateTaxBySlabs,
  getCurrentFinancialYear,
  normalizeRegime,
};
