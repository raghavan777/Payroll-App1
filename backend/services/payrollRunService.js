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
const { calculateComprehensivePayroll } = require("./payrollCalcService");

/**
 * Run payroll for a given period (PREVIEW / FINAL RUN)
 * Aggregates Modules 2, 3, 4, 5
 */
exports.runPayroll = async (country, state, startDate, endDate, organizationId) => {
  const payrollProfiles = await PayrollProfile.find({ organizationId }).lean();

  const payrollResults = [];

  for (const profile of payrollProfiles) {
    const { employeeCode, salaryStructure } = profile;

    const payrollData = await calculateComprehensivePayroll({
      employeeCode,
      organizationId,
      startDate,
      endDate,
      baseSalary: Number(salaryStructure.basic) || 0,
      hra: Number(salaryStructure.hra) || 0,
      allowances: Number(salaryStructure.allowances) || 0,
      country,
      state,
      financialYear: "2023-2024" // Fallback
    });

    payrollResults.push(payrollData);
  }

  return payrollResults;
};

/**
 * Save final payroll after approval (LOCKED payroll)
 */
exports.savePayroll = async (payrollResults) => {
  return Payroll.insertMany(payrollResults);
};
