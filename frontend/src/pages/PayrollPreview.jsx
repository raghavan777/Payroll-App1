import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PayrollPreview() {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayrollPreview = async () => {
            try {
                const res = await api.get("/api/payroll/preview");
                console.log("PAYROLL PREVIEW RESPONSE:", res.data); // 🔍 debug

                setPayrolls(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load payroll preview");
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollPreview();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded shadow-md">

                <h2 className="text-2xl font-semibold mb-4">Payroll Preview</h2>

                {loading ? (
                    <p className="text-gray-500">Loading payroll data...</p>
                ) : payrolls.length === 0 ? (
                    <p className="text-gray-500">No pending payrolls available.</p>
                ) : (
                    <table className="w-full border border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Emp Code</th>
                                <th className="border p-2">Emp Name</th>
                                <th className="border p-2">Basic</th>
                                <th className="border p-2">HRA</th>
                                <th className="border p-2">Allowances</th>
                                <th className="border p-2">Worked Days</th>
                                <th className="border p-2">Net Pay</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payrolls.map((p) => (
                                <tr key={p.payrollId}>
                                    <td className="border p-2">{p.employeeCode}</td>
                                    <td className="border p-2">{p.employeeName || "-"}</td>

                                    <td className="border p-2">
                                        ₹{Number(p.basic ?? 0).toFixed(2)}
                                    </td>

                                    <td className="border p-2">
                                        ₹{Number(p.hra ?? 0).toFixed(2)}
                                    </td>

                                    <td className="border p-2">
                                        ₹{Number(p.allowances ?? 0).toFixed(2)}
                                    </td>

                                    <td className="border p-2">
                                        {p.workedDays ?? 0}
                                    </td>

                                    <td className="border p-2 font-semibold">
                                        ₹{Number(p.netPay ?? 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        disabled={payrolls.length === 0}
                        onClick={() => navigate("/payroll-approve")}
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Proceed to Approval
                    </button>
                </div>

            </div>
        </div>
    );
}
