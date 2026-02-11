import { useEffect, useState } from "react";
import { getPayrollSummary, getPayrollHistory } from "../../api/reportApi";

export default function Reports() {
    const [summary, setSummary] = useState(null);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const summaryRes = await getPayrollSummary();
            const historyRes = await getPayrollHistory();

            setSummary(summaryRes.data);
            setPayrolls(historyRes.data || []);
        } catch (err) {
            console.error("Report Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-6">Loading reports...</p>;

    return (
        <div className="p-6 space-y-6">

            {/* ================= SUMMARY CARDS ================= */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Total Employees Paid</h3>
                    <p className="text-2xl font-bold">
                        {summary?.totalEmployeesPaid || 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Total Payroll</h3>
                    <p className="text-2xl font-bold text-green-600">
                        ₹ {summary?.totalPayroll || 0}
                    </p>
                </div>
            </div>

            {/* ================= PAYROLL TABLE ================= */}
            <div className="bg-white rounded shadow p-5">
                <h2 className="text-lg font-semibold mb-4">Payroll Records</h2>

                {payrolls.length === 0 ? (
                    <p>No payroll records available</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Employee</th>
                                <th className="p-2 border">Period</th>
                                <th className="p-2 border">Gross</th>
                                <th className="p-2 border">Net</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payrolls.map((p) => (
                                <tr key={p._id}>
                                    <td className="border p-2">{p.employeeCode}</td>
                                    <td className="border p-2">
                                        {new Date(p.periodStart).toLocaleDateString()} –{" "}
                                        {new Date(p.periodEnd).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2">₹ {p.grossSalary}</td>
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
