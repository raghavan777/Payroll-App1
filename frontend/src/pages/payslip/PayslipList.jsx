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
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Earnings Archive</h1>
                <p className="text-slate-500 font-medium mt-1">Access your historical payslips and digital financial statements.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold tracking-tight">Retrieving earnings history...</p>
                </div>
            ) : payslips.length === 0 ? (
                <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <MdReceipt size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Records Found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Your payroll history will appear here once the first cycle is synchronized.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payslips.map((p) => (
                        <div key={p._id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                        <MdCalendarToday size={24} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fiscal Period</span>
                                        <span className="text-sm font-black text-slate-800">{p.payPeriod}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Compensation</span>
                                        <span className="text-2xl font-black text-emerald-600 tracking-tight">₹{p.netSalary?.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-slate-100"></div>
                                    <div className="flex items-center gap-2">
                                        <MdVerifiedUser className="text-indigo-400" size={14} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digitally Certified</span>
                                    </div>
                                </div>

                                <a
                                    href={`http://localhost:5000${p.pdfUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 w-full bg-slate-900 group-hover:bg-indigo-600 text-white font-black px-6 py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                                >
                                    <MdDownload size={20} />
                                    <span>Download Statement</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                <MdInfoOutline className="text-indigo-400 mt-1" size={20} />
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                    Digital payslips are generated using the institutional financial engine. For discrepancies in statutory deductions or base compensation, please contact the central HR node.
                </p>
            </div>
        </div>
    );
}
