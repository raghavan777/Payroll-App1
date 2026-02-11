import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import {
    MdGavel,
    MdCheckCircle,
    MdLayers,
    MdShield,
    MdInfoOutline,
    MdPayments
} from "react-icons/md";

export default function PayrollApproval() {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayrollId, setSelectedPayrollId] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        api
            .get("/api/payroll/preview")
            .then((res) => setPayrolls(res.data))
            .catch(() => toast.error("Cloud synchronization failed"))
            .finally(() => setLoading(false));
    }, []);

    const handleApprove = async () => {
        if (!selectedPayrollId) {
            return toast.error("Selection required for authorization");
        }

        try {
            setIsSubmitting(true);
            await api.post("/api/payroll/approve", {
                payrollId: selectedPayrollId,
            });

            toast.success("Institutional authorization finalized");

            setPayrolls(
                payrolls.filter((p) => p.payrollId !== selectedPayrollId)
            );
            setSelectedPayrollId("");

        } catch (err) {
            toast.error(err.response?.data?.message || "Internal authorization failure");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedPayroll = payrolls.find(p => p.payrollId === selectedPayrollId);

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center md:text-left">Payroll Authorization</h1>
                <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Final institutional sign-off for disbursement cycle ledger entries.</p>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <MdGavel size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 leading-none mb-1">Approval Protocol</h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verify & Authorize</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Select Payroll */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center block md:text-left">Target Ledger Entry</label>
                        <div className="relative">
                            <select
                                value={selectedPayrollId}
                                onChange={(e) => setSelectedPayrollId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none font-black text-slate-700 text-sm"
                            >
                                <option value="">Choose Pending Payroll Entry...</option>
                                {payrolls.map((p) => (
                                    <option key={p.payrollId} value={p.payrollId}>
                                        {p.employeeCode} | {p.employeeName} — Net: ₹{p.netPay?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <MdLayers size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Summary Card for Selection */}
                    {selectedPayroll && (
                        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <MdPayments size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Projected Disbursement</p>
                                    <h4 className="text-2xl font-black text-indigo-900 font-mono tracking-tighter">₹{selectedPayroll.netPay?.toLocaleString()}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <MdCheckCircle size={16} />
                                <span>Computational Match</span>
                            </div>
                        </div>
                    )}

                    {!selectedPayroll && !loading && payrolls.length === 0 && (
                        <div className="p-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                            <MdInfoOutline className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-black text-slate-800 mb-1">Queue Empty</h3>
                            <p className="text-slate-500 font-medium text-sm">No pending payroll entries require authorization at this time.</p>
                        </div>
                    )}

                    <div className="pt-8 border-t border-slate-100">
                        <button
                            onClick={handleApprove}
                            disabled={!selectedPayrollId || isSubmitting}
                            className="group relative w-full inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[28px] text-lg font-black tracking-tight transition-all active:scale-95 shadow-2xl shadow-rose-600/20 disabled:opacity-50 bg-rose-600 hover:bg-rose-500 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    <span>Finalizing Institutional Seal...</span>
                                </>
                            ) : (
                                <>
                                    <MdGavel size={24} className="group-hover:rotate-12 transition-transform" />
                                    <span>Authorize Entry</span>
                                </>
                            )}
                        </button>
                        <p className="text-center mt-6 flex items-center justify-center gap-2 text-slate-400">
                            <MdShield size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Irreversible institutional directive upon signature</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
