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
import Dropdown from "../components/Dropdown";

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
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-white tracking-tight">Institutional Authorization</h1>
                <p className="text-slate-300 font-medium mt-2 italic text-sm">Final institutional sign-off for disbursement cycle ledger entries.</p>
            </div>

            <div className="premium-card rounded-[40px] overflow-hidden p-8 lg:p-10 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/10 relative z-10">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md text-indigo-400 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                        <MdGavel size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-none mb-2">Approval Protocol</h2>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Verify & Authorize</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Select Payroll */}
                    <div className="space-y-4 relative z-10">
                        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 text-center block md:text-left">Target Ledger Entry</label>
                        <div className="relative group">
                            <Dropdown
                                options={payrolls.map(p => ({
                                    value: p.payrollId,
                                    label: `${p.employeeCode} | ${p.employeeName} — Net: ₹${p.netPay?.toLocaleString()}`
                                }))}
                                value={selectedPayrollId}
                                onChange={(e) => setSelectedPayrollId(e.target.value)}
                                placeholder="Choose Pending Payroll Entry..."
                                icon={MdLayers}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Summary Card for Selection */}
                    {selectedPayroll && (
                        <div className="p-8 bg-indigo-500/10 backdrop-blur-md rounded-[32px] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8 animate-in zoom-in-95 duration-500 relative z-10 shadow-2xl">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-inner">
                                    <MdPayments size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2 leading-none">Projected Disbursement</p>
                                    <h4 className="text-3xl font-black text-white font-mono tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">₹{selectedPayroll.netPay?.toLocaleString()}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                <MdCheckCircle className="animate-pulse" size={18} />
                                <span>Computation Protocol Match</span>
                            </div>
                        </div>
                    )}

                    {!selectedPayroll && !loading && payrolls.length === 0 && (
                        <div className="p-16 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10 relative z-10">
                            <MdInfoOutline className="mx-auto text-slate-600 mb-6 opacity-40" size={56} />
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Queue Exhausted</h3>
                            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest leading-relaxed">No pending payroll entries require authorization at this juncture.</p>
                        </div>
                    )}

                    <div className="pt-10 border-t border-white/10 relative z-10">
                        <button
                            onClick={handleApprove}
                            disabled={!selectedPayrollId || isSubmitting}
                            className="group relative w-full inline-flex items-center justify-center gap-4 px-12 py-6 rounded-[32px] text-sm font-black tracking-[0.2em] uppercase transition-all active:scale-95 shadow-2xl shadow-rose-600/30 disabled:opacity-50 bg-rose-600 hover:bg-rose-500 text-white overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {isSubmitting ? (
                                <>
                                    <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    <span>Finalizing Institutional Seal...</span>
                                </>
                            ) : (
                                <>
                                    <MdGavel size={28} className="group-hover:rotate-12 transition-transform relative z-10" />
                                    <span className="relative z-10">Confirm Authorization</span>
                                </>
                            )}
                        </button>
                        <div className="mt-8 flex flex-col items-center gap-3">
                            <div className="flex items-center justify-center gap-2 text-rose-400 animate-pulse">
                                <MdShield size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Irreversible Institutional Directive</span>
                            </div>
                            <p className="text-[9px] text-slate-500 text-center max-w-xs font-medium uppercase tracking-widest italic">
                                Signature upon this entry will recalibrate permanent disbursement records and trigger liquidation sequences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
