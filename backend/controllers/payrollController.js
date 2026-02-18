const PayrollProfile = require("../models/PayrollProfile");
const StatutoryConfig = require("../models/StatutoryConfig");
const TaxSlab = require("../models/TaxSlab");
const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const { logAction } = require("./auditController");

const { getAttendance, calculateLOP } = require("../services/attendanceService");
const { calculateOvertime } = require("../services/overtimeService");
const { createNotification } = require("./notificationController");


/* =====================================================
   PAYROLL PREVIEW — PENDING
===================================================== */
exports.payrollPreview = async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      organizationId: req.user.organizationId,
      status: "PENDING",
    }).lean();

    const preview = await Promise.all(
      payrolls.map(async (p) => {
        const emp = await Employee.findOne(
          { employeeCode: p.employeeCode },
          { name: 1 }
        ).lean();

        return {
          payrollId: p._id,
          employeeCode: p.employeeCode,
          employeeName: emp?.name || "-",
          basic: p.basic,
          hra: p.hra,
          allowances: p.allowances,
          workedDays: p.workedDays,
          netPay: p.netSalary,
        };
      })
    );

    res.json(preview);
  } catch (err) {
    console.error("PAYROLL PREVIEW ERROR:", err);
    res.status(500).json({ message: "Failed to load payroll preview" });
  }
};

const { calculateComprehensivePayroll } = require("../services/payrollCalcService");

/* =====================================================
   RUN PAYROLL — CALCULATE + SAVE
===================================================== */
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

exports.calculatePayroll = async (req, res) => {
  try {
    const { employeeCode, country, state, startDate, endDate, financialYear } = req.body;


    if (!employeeCode || !startDate || !endDate) {
      return res.status(400).json({
        message: "employeeCode, startDate, endDate are required",
      });
    }

    const fy = financialYear || "2023-2024"; // Default fallback

    const profile = await PayrollProfile.findOne({ employeeCode }).lean();

    if (!profile || !profile.salaryStructure) {
      return res.status(404).json({
        message: "Salary structure not configured for employee",
      });
    }

    const payrollData = await calculateComprehensivePayroll({
      employeeCode,
      organizationId: req.user.organizationId,
      startDate,
      endDate,
      baseSalary: Number(profile.salaryStructure.basic) || 0,
      hra: Number(profile.salaryStructure.hra) || 0,
      allowances: Number(profile.salaryStructure.allowances) || 0,
      country,
      state,
      financialYear: fy
    });

    await Payroll.create(payrollData);

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "PAYROLL_CALCULATED",
      module: "PAYROLL",
      details: { employeeCode, startDate, endDate },
      req
    });

    /* ================= CREATE NOTIFICATION ================= */
    await createNotification({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      title: "Payroll Calculated",
      message: `Payroll for ${employeeCode} has been calculated for ${monthNames[new Date(startDate).getMonth()]} ${new Date(startDate).getFullYear()}.`,
      type: "PAYROLL",
    });

    res.status(201).json({ message: "Payroll generated successfully", data: payrollData });

  } catch (err) {
    console.error("RUN PAYROLL ERROR:", err);
    res.status(500).json({ message: "Payroll generation failed: " + err.message });
  }
};


/* =====================================================
   PAYROLL APPROVAL
===================================================== */
exports.approvePayroll = async (req, res) => {
  try {
    const { payrollId } = req.body;

    const payroll = await Payroll.findOne({
      _id: payrollId,
      organizationId: req.user.organizationId,
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    payroll.status = "APPROVED";
    payroll.approvedAt = new Date();
    payroll.approvedBy = req.user.id;

    await payroll.save();

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "PAYROLL_APPROVED",
      module: "PAYROLL",
      details: { payrollId },
      req
    });

    /* ================= CREATE NOTIFICATION ================= */
    await createNotification({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      title: "Payroll Approved",
      message: `Payroll approved successfully`,
      type: "PAYROLL",
    });

    res.json({ message: "Payroll approved successfully" });
  } catch (err) {
    console.error("APPROVAL ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
};

/* =====================================================
   ADMIN / HR PAYROLL HISTORY
===================================================== */
exports.getPayrollHistory = async (req, res) => {
  try {
    // 🔹 RESTRICTION: Only SUPER_ADMIN can see ALL history
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access Denied: Only Super Admin can view all payroll history" });
    }

    const payrolls = await Payroll.find({
      organizationId: req.user.organizationId,
      status: "APPROVED",
    })
      .sort({ periodStart: -1 })
      .lean();

    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: "Failed to load payroll history" });
  }
};

/* =====================================================
   EMPLOYEE SELF PAYROLL HISTORY ✅
===================================================== */
exports.getMyPayrollHistory = async (req, res) => {
  try {
    let employeeCode = req.user.employeeCode;

    // 🔹 Fallback: If token doesn't have employeeCode, try to find it in DB
    if (!employeeCode) {
      const Employee = require("../models/Employee");
      const emp = await Employee.findOne({ userId: req.user.id });
      if (emp) {
        employeeCode = emp.employeeCode;
      }
    }

    if (!employeeCode) {
      console.warn("getMyPayrollHistory: No employee code found for user", req.user.id);
      return res.json([]); // Return empty history instead of error
    }

    const payrolls = await Payroll.find({
      employeeCode,
      status: "APPROVED",
    })
      .sort({ periodStart: -1 })
      .lean();

    res.json(payrolls);
  } catch (err) {
    console.error("EMPLOYEE PAYROLL HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load payroll history" });
  }
};
