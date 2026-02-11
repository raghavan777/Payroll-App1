import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    MdEventAvailable,
    MdAccessTime,
    MdCheckCircle,
    MdHistory,
    MdArrowBack,
    MdShield,
    MdLayers,
    MdSave
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function Attendance() {
    const { employeeCode } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [date, setDate] = useState("");
    const [status, setStatus] = useState("PRESENT");
    const [hours, setHours] = useState(8);

    const token = localStorage.getItem("token");

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:5000/api/attendance/${employeeCode}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAttendance(res.data);
        } catch {
            toast.error("Cloud synchronization failure");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [employeeCode]);

    const handleStatusChange = (value) => {
        setStatus(value);
        if (value === "ABSENT") setHours(0);
        else if (value === "HALF_DAY") setHours(4);
        else setHours(8);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axios.post(
                "http://localhost:5000/api/attendance",
                {
                    employeeCode,
                    date,
                    status,
                    hoursWorked: Number(hours),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Engagement record synchronized");
            setDate("");
            setStatus("PRESENT");
            setHours(8);
            loadAttendance();
        } catch {
            toast.error("Internal process interruption");
        } finally {
            setSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 max-w-6xl mx-auto pb-16 font-inter"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-4 group"
                    >
                        <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-[0.3em]">Return to Workforce Roster</span>
                    </button>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
                        Personnel Activity <span className="text-indigo-600 bg-indigo-50 px-4 py-1 rounded-2xl">ID: {employeeCode}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Real-time Sync Active</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Entry Form */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 pb-8 border-b border-slate-100 mb-10">
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-[22px] flex items-center justify-center shadow-2xl shadow-indigo-600/20">
                                    <MdEventAvailable size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1.5">Activity Log</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manual Entry Protocol</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Calendar Point</label>
                                    <div className="relative group/input">
                                        <MdEventAvailable className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-600 transition-colors" size={22} />
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-6 py-5 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Engagement Vector</label>
                                    <div className="relative group/input">
                                        <MdShield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-600 transition-colors" size={22} />
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-6 py-5 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 appearance-none"
                                        >
                                            <option value="PRESENT">PRESENT (Institutional)</option>
                                            <option value="HALF_DAY">HALF DAY (Partial)</option>
                                            <option value="ABSENT">ABSENT (Null)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Measured Duration</label>
                                    <div className="relative group/input">
                                        <MdAccessTime className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-600 transition-colors" size={22} />
                                        <input
                                            type="number"
                                            min="0"
                                            max="24"
                                            value={hours}
                                            disabled={status !== "PRESENT"}
                                            onChange={(e) => setHours(e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-6 py-5 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 disabled:opacity-40"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="group w-full inline-flex items-center justify-center gap-4 bg-[#0f172a] hover:bg-slate-800 text-white font-black px-10 py-6 rounded-[32px] shadow-2xl shadow-slate-900/20 transition-all disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <MdSave size={26} className="group-hover:translate-y-[-2px] transition-transform" />
                                            <span className="text-lg">Synchronize Entry</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-[#020617] rounded-[48px] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]"
                        />
                        <MdLayers className="text-indigo-400 mb-6" size={40} />
                        <h4 className="text-xl font-black mb-3 tracking-tight">Institutional Audit</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-80">
                            All activity adjustments are cross-referenced with payroll sensors for statutory accuracy and digital ledger integrity.
                        </p>
                    </div>
                </motion.div>

                {/* History Table */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center border border-emerald-100">
                                    <MdHistory size={26} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Activity Ledger</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-slate-100">{attendance.length} Total Records</span>
                        </div>

                        <div className="flex-1 overflow-x-auto p-4">
                            {loading ? (
                                <div className="p-32 text-center">
                                    <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6 shadow-2xl shadow-indigo-600/20"></div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing activity ledger...</p>
                                </div>
                            ) : attendance.length === 0 ? (
                                <div className="p-32 text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                        <MdEventAvailable size={56} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Ledger Empty</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto">No engagement records have been synchronized for this identity rank.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-slate-400">
                                            <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em]">Calendar Date</th>
                                            <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-center">Protocol Status</th>
                                            <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-right">Activity Scope</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((a, idx) => (
                                            <tr key={a._id} className="group">
                                                <td className="px-8 py-6 bg-slate-50/50 group-hover:bg-indigo-50/30 first:rounded-l-[32px] transition-colors border-y border-l border-transparent group-hover:border-indigo-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-all group-hover:scale-110">
                                                            <MdEventAvailable size={18} />
                                                        </div>
                                                        <span className="font-black text-slate-800 text-lg tracking-tight">{new Date(a.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 bg-slate-50/50 group-hover:bg-indigo-50/30 group-hover:border-y border-transparent group-hover:border-indigo-100 text-center transition-colors">
                                                    <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${a.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10' :
                                                        a.status === 'HALF_DAY' ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-500/10' :
                                                            'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-500/10'
                                                        }`}>
                                                        {a.status?.replace("_", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 bg-slate-50/50 group-hover:bg-indigo-50/30 last:rounded-r-[32px] transition-colors border-y border-r border-transparent group-hover:border-indigo-100 text-right">
                                                    <div className="font-mono font-black text-slate-900 text-xl tracking-tighter">
                                                        {a.hoursWorked} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-2 font-inter font-bold">HR</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
