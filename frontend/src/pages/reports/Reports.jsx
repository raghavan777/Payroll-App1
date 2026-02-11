import { useEffect, useState } from "react";
import { getPayrollSummary, getPayrollHistory, getStatutoryReport, getBankAdvice } from "../../api/reportApi";
import { toast } from "react-hot-toast";
import {
    MdAnalytics,
    MdPayments,
    MdPeople,
    MdDownload,
    MdCalendarToday,
    MdHistory,
    MdShield,
    MdLayers,
    MdVerifiedUser,
    MdDescription
} from "react-icons/md";

export default function Reports() {
    const [summary, setSummary] = useState(null);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState({ start: "", end: "" });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const summaryRes = await getPayrollSummary();
            const historyRes = await getPayrollHistory();

            setSummary(summaryRes.data);
            setPayrolls(historyRes.data || []);
        } catch (err) {
            console.error("Report Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (action, type) => {
        try {
            const res = action === 'statutory'
                ? await getStatutoryReport(type, dates.start, dates.end)
                : await getBankAdvice(dates.start, dates.end);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type || 'Bank_Advice'}_Report.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Intelligence report exported");
        } catch (err) {
            toast.error("Process interruption: Export failed");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold tracking-tight">Synthesizing institutional intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <MdAnalytics className="text-indigo-600" />
                        Institutional Analytics
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Global payroll oversight and statutory compliance monitoring.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 italic text-[10px] font-black uppercase tracking-widest">
                    <MdShield size={14} />
                    Certified Reporting Active
                </div>
            </div>

            {/* ================= SUMMARY CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <MdPeople size={24} />
                        </div>
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Workforce Compensated</h3>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">
                            {summary?.totalEmployeesPaid || 0}
                            <span className="text-sm text-slate-400 font-bold ml-2">Team Members</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <MdPayments size={24} />
                        </div>
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Aggregate Payroll Disbursement</h3>
                        <p className="text-4xl font-black text-emerald-600 tracking-tight">
                            ₹{summary?.totalPayroll?.toLocaleString() || 0}
                            <span className="text-sm text-slate-400 font-bold ml-2">Institutional Total</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= EXPORT SECTION ================= */}
            <div className="bg-slate-900 rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                <MdDownload size={22} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Intelligence Export</h2>
                        </div>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">Synchronize and export statutory compliance data and bank disbursement advisories for institutional records.</p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Period Start</label>
                                <div className="relative">
                                    <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="date"
                                        className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full sm:w-auto"
                                        value={dates.start}
                                        onChange={e => setDates({ ...dates, start: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Period End</label>
                                <div className="relative">
                                    <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="date"
                                        className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full sm:w-auto"
                                        value={dates.end}
                                        onChange={e => setDates({ ...dates, end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                        {[
                            { label: 'PF Report', type: 'PF', color: 'bg-indigo-600 hover:bg-indigo-500', action: 'statutory' },
                            { label: 'ESI Report', type: 'ESI', color: 'bg-emerald-600 hover:bg-emerald-500', action: 'statutory' },
                            { label: 'PT Report', type: 'PT', color: 'bg-amber-600 hover:bg-amber-500', action: 'statutory' },
                            { label: 'Bank Advice', type: '', color: 'bg-slate-700 hover:bg-slate-600', action: 'bank' }
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleDownload(btn.action, btn.type)}
                                className={`flex items-center justify-center gap-3 ${btn.color} text-white px-8 py-5 rounded-3xl font-black text-sm transition-all shadow-xl active:scale-95`}
                            >
                                <MdDescription size={20} />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= PAYROLL TABLE ================= */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                            <MdHistory size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 leading-none mb-1">Execution History</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Computational Cycles</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {payrolls.length === 0 ? (
                        <div className="p-20 text-center text-slate-400">
                            <MdDescription size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold">No institutional activity records found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Code</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiscal Period</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gross Comp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Net Comp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 italic">
                                {payrolls.map((p) => (
                                    <tr key={p._id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black border border-indigo-100">ID</div>
                                                <span className="font-black text-slate-800 tracking-widest uppercase">{p.employeeCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {new Date(p.periodStart).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} –{" "}
                                            {new Date(p.periodEnd).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">
                                            ₹{p.grossSalary?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-center text-lg font-black text-slate-800">
                                            ₹{p.netSalary?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {p.status === "APPROVED" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                    <MdVerifiedUser size={12} />
                                                    APPROVED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                    PENDING
                                                </span>
                                            )}
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
