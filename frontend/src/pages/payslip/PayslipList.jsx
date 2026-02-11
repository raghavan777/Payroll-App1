import { useEffect, useState } from "react";
import axios from "axios";

export default function PayslipList() {
    const [payslips, setPayslips] = useState([]);

    useEffect(() => {
        loadPayslips();
    }, []);

    const loadPayslips = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/payroll/history/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPayslips(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">My Payslips</h2>

            {payslips.length === 0 ? (
                <p>No payslips found</p>
            ) : (
                payslips.map((p) => (
                    <div key={p._id} className="p-4 mb-3 bg-white rounded shadow">
                        <p>Period: {p.payPeriod}</p>
                        <p>Net Salary: ₹{p.netSalary}</p>

                        <a
                            href={`http://localhost:5000${p.pdfUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600"
                        >
                            Download Payslip
                        </a>
                    </div>
                ))
            )}
        </div>
    );
}
