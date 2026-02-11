const PayrollProfile = require("../models/PayrollProfile");
const StatutoryConfig = require("../models/StatutoryConfig");
const TaxSlab = require("../models/TaxSlab");
const Payroll = require("../models/Payroll");

const { getAttendance, calculateLOP } = require("./attendanceService");
const { calculateOvertime } = require("./overtimeService");

/**
 * Run payroll for a given period (PREVIEW / FINAL RUN)
 * Aggregates Modules 2, 3, 4, 5
 */
exports.runPayroll = async (country, state, startDate, endDate) => {
  const payrollProfiles = await PayrollProfile.find();

  const payrollResults = [];

  for (const profile of payrollProfiles) {
    const { employeeCode, salaryStructure } = profile;
    const { basic, hra, allowances } = salaryStructure;

    /* ===============================
       1️⃣ BASIC CALCULATIONS
    =============================== */
    const dailySalary = basic / 30;
    const hourlyRate = dailySalary / 8;

    /* ===============================
       2️⃣ MODULE 5: ATTENDANCE
    =============================== */
    const attendanceRecords = await getAttendance(
      employeeCode,
      startDate,
      endDate
    );

    const lopData = await calculateLOP(
      employeeCode,
      attendanceRecords,
      startDate,
      endDate,
      dailySalary
    );

    const overtimeData = calculateOvertime(
      attendanceRecords,
      hourlyRate
    );

    /* ===============================
       3️⃣ GROSS SALARY
    =============================== */
    const grossSalary =
      basic +
      hra +
      allowances +
      overtimeData.overtimePay -
      lopData.lopAmount;

    /* ===============================
       4️⃣ MODULE 4: STATUTORY
    =============================== */
    const statutory = await StatutoryConfig.findOne({ country, state });

    const pf = statutory ? (basic * statutory.pfPercentage) / 100 : 0;
    const esi = statutory ? (grossSalary * statutory.esiPercentage) / 100 : 0;
    const professionalTax = statutory ? statutory.professionalTax : 0;

    /* ===============================
       5️⃣ MODULE 4: TAX
    =============================== */
    const taxSlab = await TaxSlab.findOne({
      country,
      state,
      minIncome: { $lte: grossSalary },
      maxIncome: { $gte: grossSalary },
    });

    const tax = taxSlab
      ? (grossSalary * taxSlab.taxPercentage) / 100
      : 0;

    /* ===============================
       6️⃣ NET SALARY
    =============================== */
    const netSalary =
      grossSalary - (pf + esi + professionalTax + tax);

    /* ===============================
       7️⃣ PUSH RESULT (PREVIEW)
    =============================== */
    payrollResults.push({
      employeeCode,
      periodStart: startDate,
      periodEnd: endDate,
      basic,
      hra,
      allowances,
      overtimeHours: overtimeData.overtimeHours,
      overtimePay: overtimeData.overtimePay,
      lopDays: lopData.lopDays,
      lopAmount: lopData.lopAmount,
      grossSalary: Number(grossSalary.toFixed(2)),
      pf: Number(pf.toFixed(2)),
      esi: Number(esi.toFixed(2)),
      professionalTax,
      tax: Number(tax.toFixed(2)),
      netSalary: Number(netSalary.toFixed(2)),
    });
  }

  return payrollResults;
};

/**
 * Save final payroll after approval (LOCKED payroll)
 */
exports.savePayroll = async (payrollResults) => {
  return Payroll.insertMany(payrollResults);
};
