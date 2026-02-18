import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    MdVisibility,
    MdCheckCircle,
    MdSearch,
    MdAttachMoney,
    MdCalendarToday,
    MdLayers,
    MdArrowForward
} from "react-icons/md";

export default function PayrollPreview() {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayrollPreview = async () => {
            try {
                const res = await api.get("/api/payroll/preview");
                setPayrolls(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                toast.error("Cloud synchronization failed");
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollPreview();
    }, []);

    const filteredPayrolls = payrolls.filter(p =>
        p.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        p.employeeCode?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header & Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Computational Preview</h1>
                    <p className="text-slate-300 font-medium italic text-xs tracking-wide">Validated ledger entries pending final institutional approval.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2 backdrop-blur-md">
                        <MdCalendarToday className="text-indigo-400" size={18} />
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Active Cycle</span>
                    </div>
                </div>
            </div>

            {/* Modern Table Container */}
            <div className="premium-card rounded-[32px] overflow-hidden flex flex-col relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                {/* Search Bar */}
                <div className="p-8 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="relative max-w-md w-full group">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                        <input
                            className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-black text-white text-xs uppercase tracking-widest"
                            placeholder="Identify specific entity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-6 py-3 bg-indigo-500/10 text-indigo-300 rounded-2xl flex items-center gap-3 border border-indigo-500/20 shadow-xl">
                            <MdLayers className="animate-pulse" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{payrolls.length} Pending Records</span>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing ledger data...</p>
                        </div>
                    ) : filteredPayrolls.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5">
                                <MdVisibility size={48} className="opacity-40" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No Forecasts Available</h3>
                            <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Initiate a payroll run to generate computational previews for approval.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Entity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Basic / HRA Allocation</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Flexible Allowances</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Tenure (Days)</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Net Liquidity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPayrolls.map((p) => (
                                    <tr key={p.payrollId} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 text-indigo-400 rounded-[18px] flex items-center justify-center font-black tracking-tighter border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all shadow-xl">
                                                    {p.employeeCode?.slice(-3) || "—"}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white tracking-tight text-base mb-1 group-hover:text-indigo-300 transition-colors">{p.employeeName || "—"}</p>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{p.employeeCode}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <div className="flex flex-col items-center">
                                                <p className="text-xs font-black text-white font-mono italic tracking-tighter mb-1">₹{Number(p.basic ?? 0).toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-indigo-300/60 font-mono tracking-tighter uppercase">HRA: ₹{Number(p.hra ?? 0).toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <span className="inline-flex px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/20 shadow-lg">
                                                ₹{Number(p.allowances ?? 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <p className="text-sm font-black text-white font-mono tracking-tighter">{p.workedDays ?? 0}</p>
                                        </td>
                                        <td className="px-8 py-7 text-right font-mono">
                                            <div className="flex flex-col items-end">
                                                <p className="text-xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">₹{Number(p.netPay ?? 0).toLocaleString()}</p>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Est. Disbursement</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Bottom Action Footer */}
                <div className="p-10 bg-white/5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-[20px] border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl">
                            <MdCheckCircle size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-black text-white tracking-tight mb-1 leading-none">Approval Gateway Redline</p>
                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] opacity-60">Verified institutional parameters • READY FOR PROTOCOL EXECUTION</p>
                        </div>
                    </div>

                    <button
                        disabled={payrolls.length === 0}
                        onClick={() => navigate("/payroll-approve")}
                        className="group relative inline-flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-50 overflow-hidden uppercase tracking-[0.2em] text-xs"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span>Finalize & Initiate Approval</span>
                        <MdArrowForward className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
