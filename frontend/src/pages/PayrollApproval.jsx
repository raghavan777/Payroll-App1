import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function PayrollApproval() {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayrollId, setSelectedPayrollId] = useState("");

    useEffect(() => {
        api
            .get("/api/payroll/preview")
            .then((res) => setPayrolls(res.data))
            .catch(() => toast.error("Failed to load payrolls"));
    }, []);

    const handleApprove = async () => {
        if (!selectedPayrollId) {
            return toast.error("Please select a payroll");
        }

        try {
            await api.post("/api/payroll/approve", {
                payrollId: selectedPayrollId,
            });

            toast.success("Payroll approved successfully");

            setPayrolls(
                payrolls.filter((p) => p.payrollId !== selectedPayrollId)
            );
            setSelectedPayrollId("");

        } catch (err) {
            toast.error(err.response?.data?.message || "Approval failed");
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">

                <h2 className="text-2xl font-semibold mb-4">Payroll Approval</h2>

                <select
                    value={selectedPayrollId}
                    onChange={(e) => setSelectedPayrollId(e.target.value)}
                    className="w-full border p-2 mb-4"
                >
                    <option value="">Select Payroll</option>
                    {payrolls.map((p) => (
                        <option key={p.payrollId} value={p.payrollId}>
                            {p.employeeCode} | Net Pay ₹{p.netPay}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleApprove}
                    className="bg-red-600 text-white w-full py-2 rounded"
                >
                    Approve Payroll
                </button>

            </div>
        </div>
    );
}
