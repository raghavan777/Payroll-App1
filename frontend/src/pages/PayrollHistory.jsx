import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function PayrollHistory() {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [payslipLoadingId, setPayslipLoadingId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.role);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    /* ================================
       LOAD PAYROLL HISTORY
    ================================ */
    const loadPayrollHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            let userRole = "";
            if (token) {
                const decoded = jwtDecode(token);
                userRole = decoded.role;
            }

            // 🔹 Dynamic Endpoint
            // ONLY SUPER_ADMIN gets to see everything.
            // Everyone else (HR, Employee, etc.) sees only THEIR own history.
            const endpoint = userRole === "SUPER_ADMIN"
                ? "/api/payroll/history"
                : "/api/payroll/history/me";

            const res = await api.get(endpoint);
            setPayrolls(res.data);
        } catch (err) {
            console.error("Failed to load payroll history", err);
            toast.error("Failed to load payroll history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayrollHistory();
    }, []);

    /* ================================
       APPROVE PAYROLL
    ================================ */
    const approvePayroll = async (payrollId) => {
        try {
            await api.post("/api/payroll/approve", { payrollId });

            toast.success("Payroll approved successfully");
            loadPayrollHistory();
        } catch (err) {
            toast.error(err.response?.data?.message || "Approval failed");
        }
    };

    /* ================================
       GENERATE / DOWNLOAD PAYSLIP
    ================================ */
    const handlePayslipDownload = async (payrollId) => {
        try {
            setPayslipLoadingId(payrollId);

            const res = await api.post("/api/payslips/generate", { payrollId });
            const url = res?.data?.pdfUrl;

            if (!url) {
                toast.error("Payslip generated, but URL missing");
                return;
            }

            window.open(url, "_blank", "noopener,noreferrer");
            toast.success("Payslip ready");
        } catch (err) {
            // 409 means payslip already exists. Reuse and open existing URL.
            if (err.response?.status === 409) {
                const existingUrl = err.response?.data?.payslip?.pdfUrl;
                if (existingUrl) {
                    const base = (api.defaults.baseURL || "").replace(/\/$/, "");
                    const absoluteUrl = existingUrl.startsWith("http")
                        ? existingUrl
                        : `${base}${existingUrl.startsWith("/") ? existingUrl : `/${existingUrl}`}`;

                    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
                    toast.success("Opened existing payslip");
                    return;
                }
            }

            toast.error(err.response?.data?.message || "Failed to open payslip");
        } finally {
            setPayslipLoadingId("");
        }
    };

    if (loading) {
        return <p className="p-6">Loading payroll history...</p>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded shadow-md">

                <h2 className="text-2xl font-semibold mb-6">
                    Payroll History
                </h2>

                {payrolls.length === 0 ? (
                    <p className="text-gray-500">No payroll records found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Employee Code</th>
                                    <th className="border p-2">Period</th>
                                    <th className="border p-2">Gross Salary</th>
                                    <th className="border p-2">Net Salary</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payrolls.map((p) => (
                                    <tr key={p._id}>
                                        <td className="border p-2 font-semibold">
                                            {p.employeeCode}
                                        </td>

                                        <td className="border p-2">
                                            {new Date(p.periodStart).toLocaleDateString()} –{" "}
                                            {new Date(p.periodEnd).toLocaleDateString()}
                                        </td>

                                        <td className="border p-2">
                                            ₹{p.grossSalary}
                                        </td>

                                        <td className="border p-2 font-semibold">
                                            ₹{p.netSalary}
                                        </td>

                                        <td className="border p-2">
                                            {p.status === "APPROVED" ? (
                                                <span className="text-green-600 font-semibold">
                                                    APPROVED
                                                </span>
                                            ) : (
                                                <span className="text-orange-600 font-semibold">
                                                    PENDING
                                                </span>
                                            )}
                                        </td>

                                        <td className="border p-2">
                                            <div className="flex flex-wrap gap-2">
                                                {role === "SUPER_ADMIN" && p.status !== "APPROVED" && (
                                                    <button
                                                        onClick={() => approvePayroll(p._id)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                )}

                                                {p.status === "APPROVED" && (
                                                    <button
                                                        onClick={() => handlePayslipDownload(p._id)}
                                                        disabled={payslipLoadingId === p._id}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                                                    >
                                                        {payslipLoadingId === p._id ? "Preparing..." : "Download Payslip"}
                                                    </button>
                                                )}
                                            </div>
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
