const PayrollRun = require("../models/PayrollRun");
const Payroll = require("../models/Payroll");
const { runPayroll, savePayroll } = require("../services/payrollRunService");

/**
 * ===============================
 * 1️⃣ PREVIEW PAYROLL (NO SAVE)
 * ===============================
 * Calculates payroll for a period
 * Used before approval
 */
exports.previewPayroll = async (req, res) => {
  try {
    const { country, state, startDate, endDate } = req.body;

    const payrollPreview = await runPayroll(
      country,
      state,
      startDate,
      endDate
    );

    return res.json({
      message: "Payroll preview generated",
      data: payrollPreview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * 2️⃣ APPROVE PAYROLL
 * ===============================
 * Saves payroll data and marks run as APPROVED
 */
exports.approvePayroll = async (req, res) => {
  try {
    const { country, state, startDate, endDate, month, year } = req.body;

    // Prevent duplicate payroll runs
    const existingRun = await PayrollRun.findOne({ month, year });
    if (existingRun) {
      return res
        .status(400)
        .json({ message: "Payroll already processed for this month" });
    }

    // Generate final payroll data
    const payrollResults = await runPayroll(
      country,
      state,
      startDate,
      endDate
    );

    // Save payroll records
    await savePayroll(payrollResults);

    // Create payroll run record
    const payrollRun = await PayrollRun.create({
      month,
      year,
      status: "APPROVED",
      generatedAt: new Date(),
    });

    return res.status(201).json({
      message: "Payroll approved successfully",
      payrollRun,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * 3️⃣ LOCK PAYROLL
 * ===============================
 * Once locked, payroll CANNOT be changed
 */
exports.lockPayroll = async (req, res) => {
  try {
    const { runId } = req.body;

    const payrollRun = await PayrollRun.findById(runId);
    if (!payrollRun) {
      return res.status(404).json({ message: "Payroll run not found" });
    }

    if (payrollRun.status === "LOCKED") {
      return res
        .status(400)
        .json({ message: "Payroll already locked" });
    }

    payrollRun.status = "LOCKED";
    await payrollRun.save();

    return res.json({
      message: "Payroll locked successfully",
      payrollRun,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
