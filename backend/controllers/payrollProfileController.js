const PayrollProfile = require("../models/PayrollProfile");
const Employee = require("../models/Employee");

/**
 * CREATE Payroll Profile
 * Input: employeeCode = EMP-2026-0005
 */
exports.createPayrollProfile = async (req, res) => {
  try {
    const { employeeCode, salaryStructure, bankDetails, taxRegime } = req.body;
    const organizationId = req.user.organizationId;

    if (!employeeCode) {
      return res.status(400).json({ message: "Employee code is required" });
    }

    // ✅ Find employee by BUSINESS CODE
    const employee = await Employee.findOne({
      employeeCode: employeeCode,
      organizationId
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ❌ Prevent duplicate
    const existing = await PayrollProfile.findOne({
      employee: employee._id,
      organizationId
    });

    if (existing) {
      return res.status(400).json({
        message: "Payroll profile already exists for this employee"
      });
    }

    const profile = await PayrollProfile.create({
      employee: employee._id,              // ObjectId ref
      employeeCode: employee.employeeCode,   // EMP-2026-0003
      salaryStructure,
      bankDetails,
      taxRegime,
      organizationId
    });

    res.status(201).json(profile);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET Single Payroll Profile
 * Route: /api/payroll-profile/:employeeCode
 */
exports.getPayrollProfile = async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const profile = await PayrollProfile.findOne({ employeeCode })
      .populate("salaryTemplate")
      .populate("employee");
    if (!profile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    const employee = await Employee.findOne({ employeeCode });

    res.json({
      ...profile.toObject(),
      employeeName: employee?.name || null
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * GET All Payroll Profiles
 */
exports.getAllPayrollProfiles = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const profiles = await PayrollProfile.find({ organizationId })
      .populate("employee", "name employeeCode") // only required fields
      .populate("salaryTemplate");

    // ✅ Normalize response for frontend
    const formatted = profiles.map((p) => ({
      ...p.toObject(),
      employeeName: p.employee?.name || "—",
    }));

    return res.json(formatted);

  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
/**
 * UPDATE Payroll Profile
 * Route: /api/payroll-profile/:employeeCode
 */
exports.updatePayrollProfile = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const organizationId = req.user.organizationId;

    const updated = await PayrollProfile.findOneAndUpdate(
      { employeeCode, organizationId },
      {
        $set: {
          salaryStructure: req.body.salaryStructure,
          bankDetails: req.body.bankDetails,
          taxRegime: req.body.taxRegime,
        },
      },
      { new: true }
    )
      .populate("employee")
      .populate("salaryTemplate");

    if (!updated) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    return res.json(updated);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE Payroll Profile
 * Route: /api/payroll-profile/:employeeCode
 */
exports.deletePayrollProfile = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const organizationId = req.user.organizationId;

    const deleted = await PayrollProfile.findOneAndDelete({
      employeeCode,
      organizationId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    return res.json({ message: "Payroll profile deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ASSIGN Salary Template
 * Route: /api/payroll-profile/:employeeCode/assign-template
 */
exports.assignSalaryTemplate = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { templateId } = req.body;
    const organizationId = req.user.organizationId;

    const updatedProfile = await PayrollProfile.findOneAndUpdate(
      { employeeCode, organizationId },
      { salaryTemplate: templateId },
      { new: true }
    ).populate("salaryTemplate");

    if (!updatedProfile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    return res.json({
      message: "Salary template assigned successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error("ASSIGN TEMPLATE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
