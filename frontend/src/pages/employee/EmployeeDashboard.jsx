import { useEffect, useState } from "react";
import {
    getEmployeeDashboard,
    getMyPayslips,
} from "../../api/employeeDashboardApi";

export default function EmployeeDashboard() {
    const [stats, setStats] = useState({});
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const statsRes = await getEmployeeDashboard();
            const payslipRes = await getMyPayslips();

            setStats(statsRes.data || {});
            setPayslips(payslipRes.data || []);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-6">Loading dashboard...</p>;

    return (
        <div className="p-6 space-y-6">

            {/* ================= KPI CARDS ================= */}
            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Latest Salary</h3>
                    <p className="text-2xl font-bold text-green-600">
                        ₹ {stats.latestSalary || 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Total Payslips</h3>
                    <p className="text-2xl font-bold">
                        {stats.totalPayslips || 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Payroll Status</h3>
                    <p className="text-xl font-bold text-indigo-600">
                        {stats.status || "No Payroll"}
                    </p>
                </div>

            </div>

            {/* ================= RECENT PAYSLIPS ================= */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">
                    Recent Payslips
                </h2>

                {payslips.length === 0 ? (
                    <p>No payslips available</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Month</th>
                                <th className="border p-2">Net Salary</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payslips.slice(0, 5).map((p) => (
                                <tr key={p._id}>
                                    <td className="border p-2">
                                        {p.month || "-"}
                                    </td>

                                    <td className="border p-2 font-semibold">
                                        ₹ {p.netSalary}
                                    </td>

                                    <td className="border p-2">
                                        {p.status === "APPROVED" ? (
                                            <span className="text-green-600 font-bold">
                                                APPROVED
                                            </span>
                                        ) : (
                                            <span className="text-orange-500 font-bold">
                                                PENDING
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
