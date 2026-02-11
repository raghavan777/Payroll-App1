const SalaryTemplate = require("../models/SalaryTemplate");
const PayrollProfile = require("../models/PayrollProfile");

//
// CREATE SALARY TEMPLATE
//
exports.createSalaryTemplate = async (req, res) => {
  try {
    const {
      name,
      basicPercent,
      hraPercent,
      allowancePercent,
      pfPercent,
      esiPercent,
      taxPercent
    } = req.body;

    // Validation (Optional but good)
    if (!name || basicPercent == null || hraPercent == null || allowancePercent == null) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const data = {
      name,
      basicPercent,
      hraPercent,
      allowancePercent,
      pfPercent,
      esiPercent,
      taxPercent,
      createdBy: req.user.userId,
      organizationId: req.user.organizationId
    };

    const template = await SalaryTemplate.create(data);
    return res.status(201).json(template);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


//
// GET ALL TEMPLATES (Organization Based)
//
exports.getSalaryTemplates = async (req, res) => {
  try {
    const templates = await SalaryTemplate.find({
      organizationId: req.user.organizationId
    });

    return res.json(templates);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSalaryTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const template = await SalaryTemplate.findOne({
      _id: id,
      organizationId,
    });

    if (!template) {
      return res.status(404).json({ message: "Salary template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// ASSIGN TEMPLATE TO A PAYROLL PROFILE
//
exports.assignTemplateToProfile = async (req, res) => {
  try {
    const { profileId, templateId } = req.body;

    if (!profileId || !templateId) {
      return res.status(400).json({ message: "Profile ID & Template ID are required" });
    }

    const profile = await PayrollProfile.findOne({
      _id: profileId,
      organizationId: req.user.organizationId
    });

    if (!profile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    profile.salaryTemplate = templateId;
    await profile.save();

    return res.json({ message: "Template assigned successfully", profile });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


//
// DELETE SALARY TEMPLATE
//
exports.deleteSalaryTemplate = async (req, res) => {
  try {
    const deleted = await SalaryTemplate.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.json({ message: "Template deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateSalaryTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const updated = await SalaryTemplate.findOneAndUpdate(
      { _id: id, organizationId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Salary template not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// SALARY PREVIEW (supports ObjectId or Email)
//
exports.calculateSalaryByProfile = async (req, res) => {
  try {
    const profile = await PayrollProfile.findOne({ employeeCode: req.params.profileId })
      .populate("salaryTemplate");

    if (!profile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    if (!profile.salaryTemplate) {
      return res.status(400).json({ message: "Salary template not assigned" });
    }

    const template = profile.salaryTemplate;

    // Extract salary structure
    const basic = Number(profile.salaryStructure.basic) || 0;
    const hra = Number(profile.salaryStructure.hra) || 0;
    const allowances = Number(profile.salaryStructure.allowances) || 0;

    // GROSS Salary Calculation
    const grossSalary = basic + hra + allowances;

    // Deductions based on percentages
    const pf = (Number(template.pfPercent) / 100) * basic;
    const esi = (Number(template.esiPercent) / 100) * grossSalary;
    const tax = (Number(template.taxPercent) / 100) * grossSalary;

    const totalDeductions = pf + esi + tax;
    const netSalary = grossSalary - totalDeductions;

    return res.json({
      employeeCode: profile.employeeCode,
      grossSalary,
      deductions: {
        pf,
        esi,
        tax,
        totalDeductions
      },
      netSalary
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

