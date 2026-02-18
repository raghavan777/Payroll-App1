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
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Financial Ledger</h1>
                    <p className="text-slate-300 font-medium italic text-xs tracking-wide">Immutable record of disbursement cycles and statutory compliance.</p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl self-center md:self-auto backdrop-blur-md">
                    <div className="px-5 py-2.5 bg-indigo-500/10 text-indigo-300 rounded-xl flex items-center gap-3 border border-indigo-500/20">
                        <MdHistory size={20} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{payrolls.length} Institutional Entries</span>
                    </div>
                </div>
            </div>

            {/* Modern Table Container */}
            <div className="premium-card rounded-[32px] overflow-hidden flex flex-col relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                {/* Search Bar */}
                <div className="p-8 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="relative max-w-md w-full group">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                        <input
                            className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-black text-white text-xs uppercase tracking-widest"
                            placeholder="Filter by institutional code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-indigo-300/40 uppercase tracking-[0.3em] italic">Validated Historical Data</span>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing institutional ledger...</p>
                        </div>
                    ) : filteredPayrolls.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5">
                                <MdReceipt size={48} className="opacity-40" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Registry Void</h3>
                            <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Either no disbursement records exist or your query yielded no institutional matches.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Target Code</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Fiscal Period</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Gross/Net Recalibration</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPayrolls.map((p) => (
                                    <tr key={p._id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 text-indigo-400 rounded-[18px] flex items-center justify-center font-black tracking-tighter border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all shadow-xl">
                                                    {p.employeeCode?.slice(-3) || "—"}
                                                </div>
                                                <p className="font-black text-white tracking-tight uppercase text-base group-hover:text-indigo-300 transition-colors">{p.employeeCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black font-mono tracking-tighter text-indigo-300 shadow-inner">
                                                    {new Date(p.periodStart).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </div>
                                                <MdArrowForward className="text-slate-600" />
                                                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black font-mono tracking-tighter text-indigo-300 shadow-inner">
                                                    {new Date(p.periodEnd).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-right font-mono">
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] font-bold text-slate-600 line-through mb-1">₹{p.grossSalary?.toLocaleString()}</p>
                                                <p className="text-base font-black text-indigo-400 tracking-tight drop-shadow-[0_0_10px_rgba(79,70,229,0.3)]">₹{p.netSalary?.toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${p.status === 'APPROVED'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center justify-end gap-3">
                                                {role === "SUPER_ADMIN" && p.status !== "APPROVED" && (
                                                    <button
                                                        onClick={() => approvePayroll(p._id)}
                                                        className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-95 shadow-xl group/btn"
                                                        title="Authorize Record"
                                                    >
                                                        <MdGavel size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                                    </button>
                                                )}

                                                {p.status === "APPROVED" && (
                                                    <button
                                                        onClick={() => handlePayslipDownload(p._id)}
                                                        disabled={payslipLoadingId === p._id}
                                                        className="group relative inline-flex items-center gap-3 bg-white/5 hover:bg-indigo-500/10 text-white hover:text-indigo-300 font-black px-5 py-2.5 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest overflow-hidden shadow-2xl"
                                                    >
                                                        {payslipLoadingId === p._id ? (
                                                            <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></span>
                                                        ) : (
                                                            <MdDownload size={18} className="group-hover:translate-y-px transition-transform" />
                                                        )}
                                                        <span>Download Protocol</span>
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
