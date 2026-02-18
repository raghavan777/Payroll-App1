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
import Dropdown from "../components/Dropdown";

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
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black transition-all mb-6 group text-[10px] uppercase tracking-[0.3em]"
                    >
                        <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Workforce Roster</span>
                    </button>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-3 uppercase">
                        Personnel Activity
                    </h1>
                    <p className="text-slate-400 font-medium italic text-sm tracking-wide">
                        Institutional presence monitoring for identity: <span className="text-indigo-300 font-black tracking-widest uppercase">{employeeCode}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-2xl backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Sync Active</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
                    <div className="premium-card p-10 relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-700 blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 pb-8 border-b border-white/10 mb-10">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 text-indigo-400 shadow-inner rounded-[24px] flex items-center justify-center">
                                    <MdEventAvailable size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1.5">Activity Log</h3>
                                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Manual Entry Protocol</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Calendar Point</label>
                                    <div className="relative group/input">
                                        <MdEventAvailable className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" size={24} />
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 pl-16 pr-8 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-xs tracking-widest uppercase shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Engagement Vector</label>
                                    <div className="relative group/input">
                                        <Dropdown
                                            options={[
                                                { value: "PRESENT", label: "PRESENT (Institutional)" },
                                                { value: "HALF_DAY", label: "HALF DAY (Partial)" },
                                                { value: "ABSENT", label: "ABSENT (Null)" }
                                            ]}
                                            value={status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            icon={MdShield}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Measured Duration</label>
                                    <div className="relative group/input">
                                        <MdAccessTime className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" size={24} />
                                        <input
                                            type="number"
                                            min="0"
                                            max="24"
                                            value={hours}
                                            disabled={status !== "PRESENT"}
                                            onChange={(e) => setHours(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 pl-16 pr-12 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-base font-mono tracking-tighter disabled:opacity-20 shadow-inner"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase">HR</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="group relative w-full inline-flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-xs overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    {submitting ? (
                                        <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <MdSave size={24} className="relative z-10 group-hover:scale-110 transition-transform" />
                                            <span className="relative z-10">Synchronize Entry</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] p-10 text-white relative overflow-hidden group border border-white/10 shadow-2xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                        <MdLayers className="text-indigo-400 mb-6" size={40} />
                        <h4 className="text-2xl font-black mb-3 tracking-tighter uppercase">Institutional Audit</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                            All activity adjustments are cross-referenced with payroll sensors for statutory accuracy and digital ledger integrity.
                        </p>
                    </div>
                </motion.div>

                {/* History Table */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="premium-card p-10 overflow-hidden flex flex-col h-full border border-white/5">
                        <div className="pb-10 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/5 text-indigo-400 rounded-[24px] flex items-center justify-center border border-white/10 shadow-inner">
                                    <MdHistory size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Activity Ledger</h3>
                                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Institutional Verification Trail</p>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">{attendance.length} Synchronized Records</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto py-8">
                            {loading ? (
                                <div className="p-32 text-center">
                                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing activity ledger...</p>
                                </div>
                            ) : attendance.length === 0 ? (
                                <div className="p-32 text-center">
                                    <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5 shadow-inner">
                                        <MdEventAvailable size={56} className="opacity-40" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Ledger Void</h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest leading-relaxed">No engagement records have been synchronized for this identity rank.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Calendar Cycle</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] text-center">Protocol Status</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] text-right">Activity Scope</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {attendance.map((a, idx) => (
                                            <tr key={a._id} className="group hover:bg-white/5 transition-all">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 shadow-inner transition-all group-hover:scale-110">
                                                            <MdEventAvailable size={22} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white text-base tracking-tight mb-1">{new Date(a.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Digital Signature Valid</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center">
                                                    <span className={`inline-flex px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl backdrop-blur-md ${a.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        a.status === 'HALF_DAY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                        {a.status?.replace("_", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-black text-white text-2xl font-mono tracking-tighter leading-none mb-1">{a.hoursWorked}</span>
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Institutional Hours</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            }</div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
