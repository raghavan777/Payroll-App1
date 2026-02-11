const PayrollProfile = require("../models/PayrollProfile");
const StatutoryConfig = require("../models/StatutoryConfig");
const TaxSlab = require("../models/TaxSlab");
const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");

const { getAttendance, calculateLOP } = require("../services/attendanceService");
const { calculateOvertime } = require("../services/overtimeService");

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

/* =====================================================
   RUN PAYROLL — CALCULATE + SAVE
===================================================== */
exports.calculatePayroll = async (req, res) => {
  try {
    const { employeeCode, country, state, startDate, endDate } = req.body;

    if (!employeeCode || !startDate || !endDate) {
      return res.status(400).json({
        message: "employeeCode, startDate, endDate are required",
      });
    }

    const profile = await PayrollProfile.findOne({ employeeCode }).lean();

    if (!profile || !profile.salaryStructure) {
      return res.status(404).json({
        message: "Salary structure not configured for employee",
      });
    }

    const basicMonthly = Number(profile.salaryStructure.basic) || 0;
    const hra = Number(profile.salaryStructure.hra) || 0;
    const allowances = Number(profile.salaryStructure.allowances) || 0;

    const dailyBasic = basicMonthly / 30;
    const hourlyRate = dailyBasic / 8;

    const attendanceRecords =
      (await getAttendance(
        employeeCode,
        new Date(startDate),
        new Date(endDate)
      )) || [];

    const lopData = await calculateLOP(
      employeeCode,
      attendanceRecords,
      new Date(startDate),
      new Date(endDate),
      dailyBasic
    );

    const workedDays = Number(lopData.workedDays) || 0;
    const lopDays = Number(lopData.lopDays) || 0;

    const overtimeData = calculateOvertime(attendanceRecords, hourlyRate);

    const earnedBasic = dailyBasic * workedDays;

    const grossSalary =
      earnedBasic +
      hra +
      allowances +
      (Number(overtimeData.overtimePay) || 0);

    const statutory = await StatutoryConfig.findOne({
      country,
      state,
      organizationId: req.user.organizationId,
    }).lean();

    const pf = statutory?.pfPercentage
      ? (earnedBasic * statutory.pfPercentage) / 100
      : 0;

    const esi = statutory?.esiPercentage
      ? (grossSalary * statutory.esiPercentage) / 100
      : 0;

    const professionalTax = Number(statutory?.professionalTax) || 0;

    const annualIncome = grossSalary * 12;

    let tax = 0;
    if (!Number.isNaN(annualIncome)) {
      const slab = await TaxSlab.findOne({
        country,
        state,
        minIncome: { $lte: annualIncome },
        maxIncome: { $gte: annualIncome },
      }).lean();

      if (slab?.taxPercentage) {
        tax = (grossSalary * slab.taxPercentage) / 100;
      }
    }

    const netSalary =
      grossSalary - (pf + esi + professionalTax + tax);

    await Payroll.create({
      employeeCode,
      periodStart: startDate,
      periodEnd: endDate,
      basic: earnedBasic,
      hra,
      allowances,
      workedDays,
      lopDays,
      grossSalary,
      netSalary,
      status: "PENDING",
      organizationId: req.user.organizationId,
    });

    res.status(201).json({ message: "Payroll generated successfully" });

  } catch (err) {
    console.error("RUN PAYROLL ERROR:", err);
    res.status(500).json({ message: "Payroll generation failed" });
  }
};

/* =====================================================
   PAYROLL APPROVAL
===================================================== */
const { createNotification } = require("./notificationController");

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
