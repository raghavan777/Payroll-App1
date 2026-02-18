import { useEffect, useState } from "react";
import axios from "axios";
import {
    MdReceipt,
    MdDownload,
    MdCalendarToday,
    MdAttachMoney,
    MdArrowForward,
    MdInfoOutline,
    MdLayers,
    MdVerifiedUser
} from "react-icons/md";

export default function PayslipList() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayslips();
    }, []);

    const loadPayslips = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/payroll/history/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPayslips(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Earnings Archive</h1>
                <p className="text-slate-300 font-medium italic text-sm tracking-wide">Historical institutional disbursement records and digital financial statements.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Retrieving earnings archive...</p>
                </div>
            ) : payslips.length === 0 ? (
                <div className="premium-card rounded-[44px] overflow-hidden p-24 text-center relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/10 shadow-inner">
                        <MdReceipt size={56} className="opacity-40" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Archive Empty</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Your payroll history will synchronize here once the first institutional cycle is finalized.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payslips.map((p) => (
                        <div key={p._id} className="premium-card rounded-[40px] hover:shadow-[0_25px_60px_rgba(79,70,229,0.3)] hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
                            <div className="p-10 relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="flex items-center justify-between mb-10">
                                    <div className="w-16 h-16 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                                        <MdCalendarToday size={32} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-indigo-300/40 uppercase tracking-[0.2em] leading-none mb-2">Fiscal Period</span>
                                        <span className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-widest">{p.payPeriod}</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Net Compensation</span>
                                            <span className="text-7xl font-black text-white/5 absolute -left-8 bottom-0 select-none pointer-events-none tracking-tighter">₹</span>
                                        </div>
                                        <span className="text-3xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] tabular-nums">₹{p.netSalary?.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/5"></div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 w-fit">
                                        <MdVerifiedUser className="text-emerald-400 animate-pulse" size={16} />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Digitally Certified Protocol</span>
                                    </div>
                                </div>

                                <a
                                    href={`http://localhost:5000${p.pdfUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group/btn relative inline-flex items-center justify-center gap-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-5 rounded-[24px] transition-all shadow-[0_15px_40px_rgba(79,70,229,0.4)] active:scale-95 overflow-hidden uppercase tracking-[0.2em] text-xs"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                    <MdDownload size={22} className="relative z-10 group-hover/btn:translate-y-px transition-transform" />
                                    <span className="relative z-10">Download Statement</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 p-8 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 flex items-start gap-5 relative z-10 shadow-inner">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-xl">
                    <MdInfoOutline size={24} />
                </div>
                <p className="text-xs font-black text-slate-500 leading-relaxed italic uppercase tracking-widest opacity-80">
                    Digital payslips are generated using the institutional financial engine. For discrepancies in statutory deductions or base compensation, please initiate a protocol review with the central HR node.
                </p>
            </div>
        </div>
    );
}
