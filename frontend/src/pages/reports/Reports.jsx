import { useEffect, useState } from "react";
import { getPayrollSummary, getPayrollHistory, getStatutoryReport, getBankAdvice } from "../../api/reportApi";
import { toast } from "react-hot-toast";

export default function Reports() {
    const [summary, setSummary] = useState(null);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState({ start: "", end: "" });

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

    const handleDownload = async (action, type) => {
        try {
            const res = action === 'statutory'
                ? await getStatutoryReport(type, dates.start, dates.end)
                : await getBankAdvice(dates.start, dates.end);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type || 'Bank_Advice'}_Report.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error("Failed to download report");
        }
    };

    if (loading) return <p className="p-6">Loading reports...</p>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold">Payroll & Statutory Reports</h1>

            {/* ================= SUMMARY CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Employees Paid</h3>
                    <p className="text-3xl font-extrabold mt-1">
                        {summary?.totalEmployeesPaid || 0}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Payroll</h3>
                    <p className="text-3xl font-extrabold text-green-600 mt-1">
                        ₹ {summary?.totalPayroll?.toLocaleString() || 0}
                    </p>
                </div>
            </div>

            {/* ================= EXPORT SECTION ================= */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Export Statutory & Bank Reports</h2>

                <div className="flex flex-wrap gap-4 items-end mb-6">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="border rounded p-2 text-sm"
                            value={dates.start}
                            onChange={e => setDates({ ...dates, start: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">End Date</label>
                        <input
                            type="date"
                            className="border rounded p-2 text-sm"
                            value={dates.end}
                            onChange={e => setDates({ ...dates, end: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => handleDownload('statutory', 'PF')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Download PF Report</button>
                    <button onClick={() => handleDownload('statutory', 'ESI')} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">Download ESI Report</button>
                    <button onClick={() => handleDownload('statutory', 'PT')} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">Download PT Report</button>
                    <button onClick={() => handleDownload('bank')} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-black transition">Download Bank Advice</button>
                </div>
            </div>

            {/* ================= PAYROLL TABLE ================= */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Payroll History</h2>

                {payrolls.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No payroll records available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 font-semibold text-sm">Employee</th>
                                    <th className="p-3 font-semibold text-sm">Period</th>
                                    <th className="p-3 font-semibold text-sm">Gross</th>
                                    <th className="p-3 font-semibold text-sm">Net</th>
                                    <th className="p-3 font-semibold text-sm">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payrolls.map((p) => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3 text-sm">{p.employeeCode}</td>
                                        <td className="p-3 text-sm">
                                            {new Date(p.periodStart).toLocaleDateString()} –{" "}
                                            {new Date(p.periodEnd).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-sm">₹ {p.grossSalary?.toLocaleString()}</td>
                                        <td className="p-3 text-sm font-semibold">₹ {p.netSalary?.toLocaleString()}</td>
                                        <td className="p-3">
                                            {p.status === "APPROVED" ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">APPROVED</span>
                                            ) : (
                                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">PENDING</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
