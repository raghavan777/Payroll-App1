const Payroll = require("../models/Payroll");

/* ================= SUMMARY ================= */
exports.getAnalyticsSummary = async (req, res) => {
    try {
        const payrolls = await Payroll.find({
            organizationId: req.user.organizationId,
        });

        const totalPayroll = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
        const employeesPaid = payrolls.length;
        const averageSalary = employeesPaid
            ? Math.round(totalPayroll / employeesPaid)
            : 0;

        res.json({
            totalPayroll,
            employeesPaid,
            averageSalary,
        });
    } catch (err) {
        res.status(500).json({ message: "Analytics summary failed" });
    }
};

/* ================= TREND ================= */
exports.getPayrollTrend = async (req, res) => {
    try {
        const data = await Payroll.aggregate([
            {
                $match: { organizationId: req.user.organizationId },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$periodStart" },
                        month: { $month: "$periodStart" },
                    },
                    totalPayroll: { $sum: "$netSalary" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const formatted = data.map((d) => ({
            month: `${d._id.month}/${d._id.year}`,
            totalPayroll: d.totalPayroll,
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Payroll trend failed" });
    }
};
