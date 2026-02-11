const Payroll = require("../models/Payroll");
const PayrollProfile = require("../models/PayrollProfile");
const Employee = require("../models/Employee");
const { logAction } = require("./auditController");
const xlsx = require("xlsx");

exports.getPayrollSummary = async (req, res) => {
    try {
        const orgId = req.user.organizationId;
        const payrolls = await Payroll.find({ organizationId: orgId });
        const totalPayroll = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

        res.json({
            totalEmployeesPaid: payrolls.length,
            totalPayroll,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate report" });
    }
};

exports.getStatutoryReports = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query; // type: PF, ESI, PT
        const orgId = req.user.organizationId;

        const query = {
            organizationId: orgId,
            status: "APPROVED"
        };
        if (startDate && endDate) {
            query.periodStart = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const payrolls = await Payroll.find(query).lean();

        const reportData = payrolls.map(p => {
            const field = type === 'PT' ? 'professionalTax' : type.toLowerCase();
            return {
                EmployeeCode: p.employeeCode,
                Period: p.periodStart ? p.periodStart.toISOString().slice(0, 7) : "N/A",
                Basic: p.basic,
                Gross: p.grossSalary,
                [type]: p[field] || 0,
            };
        });

        await logAction({
            userId: req.user.id,
            organizationId: req.user.organizationId,
            action: `REPORT_DOWNLOADED_${type}`,
            module: "REPORT",
            details: { type, startDate, endDate },
            req
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(reportData);
        xlsx.utils.book_append_sheet(wb, ws, "Report");

        const buffer = xlsx.write(wb, { type: "buffer", bookType: "csv" });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${type}_Report.csv`);
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate statutory report" });
    }
};

exports.getBankAdvice = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const orgId = req.user.organizationId;

        const query = {
            organizationId: orgId,
            status: "APPROVED"
        };
        if (startDate && endDate) {
            query.periodStart = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const payrolls = await Payroll.find(query).lean();

        const adviceData = await Promise.all(payrolls.map(async p => {
            const profile = await PayrollProfile.findOne({ employeeCode: p.employeeCode }).lean();
            const emp = await Employee.findOne({ employeeCode: p.employeeCode }).lean();

            return {
                EmployeeName: emp?.name || "N/A",
                EmployeeCode: p.employeeCode,
                BankName: profile?.bankDetails?.bankName || "N/A",
                AccountNumber: profile?.bankDetails?.accountNumber || "N/A",
                IFSC: profile?.bankDetails?.ifsc || "N/A",
                NetSalary: p.netSalary,
                Period: p.periodStart.toISOString().slice(0, 7)
            };
        }));

        await logAction({
            userId: req.user.id,
            organizationId: req.user.organizationId,
            action: "BANK_ADVICE_DOWNLOADED",
            module: "REPORT",
            details: { startDate, endDate },
            req
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(adviceData);
        xlsx.utils.book_append_sheet(wb, ws, "BankAdvice");

        const buffer = xlsx.write(wb, { type: "buffer", bookType: "csv" });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=Bank_Advice_${new Date().toISOString().slice(0, 10)}.csv`);
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate bank advice" });
    }
};
