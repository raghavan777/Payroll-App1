import { useEffect, useState } from "react";
import {
    getAnalyticsSummary,
    getPayrollTrend,
} from "../../api/analyticsApi";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const [summary, setSummary] = useState({});
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const summaryRes = await getAnalyticsSummary();
            const trendRes = await getPayrollTrend();

            setSummary(summaryRes.data);
            setTrend(trendRes.data || []);
        } catch (err) {
            console.error("Analytics Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-6">Loading analytics...</p>;

    return (
        <div className="p-6 space-y-6">

            {/* ================= KPI CARDS ================= */}
            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Total Payroll</h3>
                    <p className="text-2xl font-bold text-green-600">
                        ₹ {summary.totalPayroll || 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Employees Paid</h3>
                    <p className="text-2xl font-bold">
                        {summary.employeesPaid || 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-gray-600">Average Salary</h3>
                    <p className="text-2xl font-bold">
                        ₹ {summary.averageSalary || 0}
                    </p>
                </div>

            </div>

            {/* ================= SALARY TREND CHART ================= */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">
                    Monthly Payroll Trend
                </h2>

                {trend.length === 0 ? (
                    <p>No trend data available</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="totalPayroll"
                                stroke="#4f46e5"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
