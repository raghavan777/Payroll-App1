const StatutoryConfig = require("../models/StatutoryConfig");
const TaxSlab = require("../models/TaxSlab");
const TaxDeclaration = require("../models/TaxDeclaration");
const { getAttendance, calculateLOP } = require("./attendanceService");
const { calculateOvertime } = require("./overtimeService");

/**
 * Unified Payroll Calculation Logic
 * Consolidates LOP, Overtime, Statutory, and Tax calculations.
 */
exports.calculateComprehensivePayroll = async ({
    employeeCode,
    organizationId,
    startDate,
    endDate,
    baseSalary,
    hra,
    allowances,
    country,
    state,
    financialYear
}) => {
    // 1. Attendance & LOP
    const attendanceRecords = await getAttendance(employeeCode, startDate, endDate);
    const dailyBasic = baseSalary / 30;
    const hourlyRate = dailyBasic / 8;

    const lopData = await calculateLOP(
        employeeCode,
        attendanceRecords,
        startDate,
        endDate,
        dailyBasic
    );

    const overtimeData = calculateOvertime(attendanceRecords, hourlyRate);

    // 2. Gross Components
    const earnedBasic = dailyBasic * (30 - lopData.lopDays); // Adjusted for LOP
    const grossSalary = earnedBasic + hra + allowances + (overtimeData.overtimePay || 0);

    // 3. Statutory Deductions
    const statutory = await StatutoryConfig.findOne({
        country,
        state,
        // organizationId  // Assuming global for now, but good to have if specific
    }).lean();

    const pf = statutory?.pfPercentage ? (earnedBasic * statutory.pfPercentage) / 100 : 0;
    const esi = statutory?.esiPercentage ? (grossSalary * statutory.esiPercentage) / 100 : 0;
    const professionalTax = Number(statutory?.professionalTax) || 0;

    // 4. Tax Calculation (Integration with Module 8)
    const declaration = await TaxDeclaration.findOne({
        employeeCode, // Or employeeId if linked
        financialYear
    }).lean();

    const annualGross = grossSalary * 12;
    const standardDeduction = 50000; // Common static for now
    const investments = declaration ? declaration.investments : 0;
    const taxableIncome = Math.max(0, annualGross - standardDeduction - investments);

    let tax = 0;
    const taxSlabDoc = await TaxSlab.findOne({
        country,
        state,
        financialYear,
        // Note: Assuming progressive logic if slabs array exists, or flat if legacy fields exist
    }).lean();

    if (taxSlabDoc) {
        if (taxSlabDoc.slabs && taxSlabDoc.slabs.length > 0) {
            // Progressive logic
            let remainingIncome = taxableIncome;
            const sortedSlabs = [...taxSlabDoc.slabs].sort((a, b) => a.min - b.min);

            for (const slab of sortedSlabs) {
                if (taxableIncome > slab.min) {
                    const slabLimit = slab.max ? slab.max - slab.min : Infinity;
                    const amountInSlab = Math.min(taxableIncome - slab.min, slabLimit);
                    tax += (amountInSlab * slab.rate) / 100;
                }
            }
        } else if (taxSlabDoc.taxPercentage) {
            // Legacy flat rate
            tax = (taxableIncome * taxSlabDoc.taxPercentage) / 100;
        }
    }

    const monthlyTax = tax / 12;

    // 5. Net Salary
    const totalDeductions = pf + esi + professionalTax + monthlyTax;
    const netSalary = grossSalary - totalDeductions;

    return {
        employeeCode,
        periodStart: startDate,
        periodEnd: endDate,
        basic: Number(earnedBasic.toFixed(2)),
        hra: Number(hra.toFixed(2)),
        allowances: Number(allowances.toFixed(2)),
        overtimeHours: overtimeData.overtimeHours,
        overtimePay: overtimeData.overtimePay,
        workedDays: 30 - lopData.lopDays,
        lopDays: lopData.lopDays,
        lopAmount: lopData.lopAmount,
        grossSalary: Number(grossSalary.toFixed(2)),
        pf: Number(pf.toFixed(2)),
        esi: Number(esi.toFixed(2)),
        professionalTax: Number(professionalTax.toFixed(2)),
        tax: Number(monthlyTax.toFixed(2)),
        netSalary: Number(netSalary.toFixed(2)),
        status: "PENDING",
        organizationId
    };
};
