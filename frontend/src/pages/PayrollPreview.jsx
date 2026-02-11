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
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Computational Preview</h1>
                    <p className="text-slate-500 font-medium mt-1">Validated ledger entries pending final institutional approval.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <MdCalendarToday className="text-indigo-400" size={18} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cycle</span>
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
                            placeholder="Search entities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-2">
                            <MdLayers size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{payrolls.length} Pending Records</span>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-bold tracking-tight">Processing ledger data...</p>
                        </div>
                    ) : filteredPayrolls.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <MdVisibility size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Forecasts Available</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Initiate a payroll run to generate computational previews for approval.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Entity</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Basic / HRA</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Allowances</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tenure (Days)</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Net Liquidity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPayrolls.map((p) => (
                                    <tr key={p.payrollId} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black tracking-tighter shadow-sm">
                                                    {p.employeeCode?.slice(-3) || "—"}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{p.employeeName || "—"}</p>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.employeeCode}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <p className="text-xs font-black text-slate-600 font-mono italic tracking-tighter">B: ₹{Number(p.basic ?? 0).toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">H: ₹{Number(p.hra ?? 0).toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                ₹{Number(p.allowances ?? 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <p className="text-sm font-black text-slate-600 font-mono tracking-tighter">{p.workedDays ?? 0}</p>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono">
                                            <div className="flex flex-col items-end">
                                                <p className="text-base font-black text-emerald-600 tracking-tight">₹{Number(p.netPay ?? 0).toLocaleString()}</p>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Est. Net Disbursement</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Bottom Action Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                            <MdCheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">Approval Ready</p>
                            <p className="text-xs font-medium text-slate-500">All computations are verified against statutory slabs.</p>
                        </div>
                    </div>

                    <button
                        disabled={payrolls.length === 0}
                        onClick={() => navigate("/payroll-approve")}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <span>Finalize & Proceed</span>
                        <MdArrowForward size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
