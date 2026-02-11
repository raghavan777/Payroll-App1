import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import {
    MdReceipt,
    MdSearch,
    MdDownload,
    MdCheckCircle,
    MdHistory,
    MdGavel,
    MdPayments,
    MdCalendarToday,
    MdArrowForward
} from "react-icons/md";

export default function PayrollHistory() {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
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

    const loadPayrollHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            let userRole = "";
            if (token) {
                const decoded = jwtDecode(token);
                userRole = decoded.role;
            }

            const endpoint = userRole === "SUPER_ADMIN"
                ? "/api/payroll/history"
                : "/api/payroll/history/me";

            const res = await api.get(endpoint);
            setPayrolls(res.data);
        } catch (err) {
            toast.error("Cloud synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayrollHistory();
    }, []);

    const approvePayroll = async (payrollId) => {
        try {
            await api.post("/api/payroll/approve", { payrollId });
            toast.success("Institutional authorization finalized");
            loadPayrollHistory();
        } catch (err) {
            toast.error(err.response?.data?.message || "Internal authorization failure");
        }
    };

    const handlePayslipDownload = async (payrollId) => {
        try {
            setPayslipLoadingId(payrollId);
            const res = await api.post("/api/payslips/generate", { payrollId });
            const url = res?.data?.pdfUrl;

            if (!url) {
                toast.error("Document generated, but access URI missing");
                return;
            }

            window.open(url, "_blank", "noopener,noreferrer");
            toast.success("Document retrieval initiated");
        } catch (err) {
            if (err.response?.status === 409) {
                const existingUrl = err.response?.data?.payslip?.pdfUrl;
                if (existingUrl) {
                    const base = (api.defaults.baseURL || "").replace(/\/$/, "");
                    const absoluteUrl = existingUrl.startsWith("http")
                        ? existingUrl
                        : `${base}${existingUrl.startsWith("/") ? existingUrl : `/${existingUrl}`}`;

                    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
                    toast.success("Retrieved archived ledger");
                    return;
                }
            }
            toast.error(err.response?.data?.message || "Failed to retrieve document");
        } finally {
            setPayslipLoadingId("");
        }
    };

    const filteredPayrolls = payrolls.filter(p =>
        p.employeeCode?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Ledger</h1>
                    <p className="text-slate-500 font-medium mt-1">Immutable record of disbursement cycles and statutory compliance.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-center md:self-auto">
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-2">
                        <MdHistory size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">{payrolls.length} Entries</span>
                    </div>
                </div>
            </div>

            {/* Modern Table Container */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                            placeholder="Search by code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Institutional Records Only</span>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-bold tracking-tight">Syncing institutional ledger...</p>
                        </div>
                    ) : filteredPayrolls.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <MdReceipt size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Registry Empty</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Either no disbursement records exist or your query yielded no institutional matches.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Target Code</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Fiscal Period</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Gross/Net Pay</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPayrolls.map((p) => (
                                    <tr key={p._id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black tracking-tighter shadow-sm border border-indigo-100">
                                                    {p.employeeCode?.slice(-3) || "—"}
                                                </div>
                                                <p className="font-black text-slate-800 tracking-tight leading-none uppercase">{p.employeeCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black font-mono tracking-tighter text-slate-500">
                                                    {new Date(p.periodStart).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </div>
                                                <MdArrowForward className="text-slate-300" />
                                                <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black font-mono tracking-tighter text-slate-500">
                                                    {new Date(p.periodEnd).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono">
                                            <div className="flex flex-col items-end">
                                                <p className="text-xs font-bold text-slate-400 line-through">₹{p.grossSalary?.toLocaleString()}</p>
                                                <p className="text-sm font-black text-indigo-600 tracking-tight">₹{p.netSalary?.toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                {role === "SUPER_ADMIN" && p.status !== "APPROVED" && (
                                                    <button
                                                        onClick={() => approvePayroll(p._id)}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                                                        title="Authorize Record"
                                                    >
                                                        <MdGavel size={18} />
                                                    </button>
                                                )}

                                                {p.status === "APPROVED" && (
                                                    <button
                                                        onClick={() => handlePayslipDownload(p._id)}
                                                        disabled={payslipLoadingId === p._id}
                                                        className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black px-4 py-2 rounded-xl border border-indigo-100 transition-all active:scale-95 disabled:opacity-50 text-xs uppercase"
                                                    >
                                                        {payslipLoadingId === p._id ? (
                                                            <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></span>
                                                        ) : (
                                                            <MdDownload size={16} />
                                                        )}
                                                        <span>Payslip</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
