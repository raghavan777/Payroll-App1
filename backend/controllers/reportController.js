const Payroll = require("../models/Payroll");

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
