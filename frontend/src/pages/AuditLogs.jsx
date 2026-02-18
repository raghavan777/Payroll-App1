import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import * as MdIcons from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Dropdown from "../components/Dropdown";

// Utility for icons based on module/action
const getModuleStyle = (module) => {
    switch (module.toUpperCase()) {
        case "PAYROLL": return { icon: <MdIcons.MdPayments />, bg: "bg-emerald-500", shadow: "shadow-emerald-200" };
        case "EMPLOYEE": return { icon: <MdIcons.MdPeople />, bg: "bg-blue-500", shadow: "shadow-blue-200" };
        case "AUTH": return { icon: <MdIcons.MdSecurity />, bg: "bg-purple-500", shadow: "shadow-purple-200" };
        case "STATUTORY": return { icon: <MdIcons.MdGavel />, bg: "bg-amber-500", shadow: "shadow-amber-200" };
        case "TAX": return { icon: <MdIcons.MdReceiptLong />, bg: "bg-rose-500", shadow: "shadow-rose-200" };
        default: return { icon: <MdIcons.MdInfo />, bg: "bg-slate-500", shadow: "shadow-slate-200" };
    }
};

const getActionColor = (action) => {
    const act = action.toUpperCase();
    if (act.includes("CREATED") || act.includes("APPROVED") || act.includes("SUCCESS")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
    if (act.includes("DELETED") || act.includes("REMOVED") || act.includes("FAILED")) return "text-rose-700 bg-rose-50 border-rose-100";
    if (act.includes("UPDATED") || act.includes("EDITED") || act.includes("CHANGED")) return "text-amber-700 bg-amber-50 border-amber-100";
    return "text-indigo-700 bg-indigo-50 border-indigo-100";
};

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moduleFilter, setModuleFilter] = useState("ALL");
    const [expandedLogId, setExpandedLogId] = useState(null);

    const { role } = useAuth();
    const isAuthorized = role === "SUPER_ADMIN";

    useEffect(() => {
        if (!isAuthorized) {
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            try {
                const res = await api.get("/api/audit");
                setLogs(res.data);
            } catch (err) {
                if (err.response?.status !== 403) {
                    toast.error("Failed to fetch audit logs");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [isAuthorized]);

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        if (moduleFilter === "ALL") return true;
        // Case-insensitive comparison and trim
        return log.module?.trim().toUpperCase() === moduleFilter.toUpperCase();
    });

    const uniqueModules = [...new Set(logs.map(log => log.module?.trim().toUpperCase()).filter(Boolean))].sort();

    return (
        <div className="relative min-h-[80vh]">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

            <div className="relative space-y-8 p-2">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 premium-card p-10 relative">
                    {/* Header Decorative Glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">
                            Audit Trail
                        </h1>
                        <p className="text-slate-300 font-medium uppercase tracking-[0.2em] text-[10px]">Real-time Institutional Synchrony</p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="relative group">
                            <Dropdown
                                options={[
                                    { value: "ALL", label: "All Protocols" },
                                    ...uniqueModules.map(m => ({ value: m, label: m }))
                                ]}
                                value={moduleFilter}
                                onChange={(e) => {
                                    setModuleFilter(e.target.value);
                                    setExpandedLogId(null);
                                }}
                                icon={MdIcons.MdFilterList}
                                className="min-w-[200px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline / List View */}
                <div className="relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 space-y-4">
                            <div className="w-16 h-16 border-4 border-indigo-200/20 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-white font-black uppercase tracking-widest text-xs">Syncing logs...</p>
                        </div>
                    ) : !isAuthorized ? (
                        <div className="p-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-6 text-5xl shadow-inner">
                                <MdIcons.MdShield />
                            </div>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Security Protocol Restricted</h3>
                            <p className="text-slate-400 mt-2 font-medium">Elevated authorization is required to access the central audit trail.</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-6 text-5xl shadow-inner">
                                <MdIcons.MdInbox />
                            </div>
                            <h3 className="text-2xl font-bold text-white">No logs found</h3>
                            <p className="text-slate-400 mt-2">Try clearing your filters to see more history.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-20">
                            <AnimatePresence initial={false}>
                                {filteredLogs.map((log) => {
                                    const moduleStyle = getModuleStyle(log.module || "SYSTEM");
                                    const isExpanded = String(expandedLogId) === String(log._id);

                                    return (
                                        <motion.div
                                            key={log._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                                            className={`group relative premium-card border-none transition-all duration-500 cursor-pointer overflow-hidden ${isExpanded ? 'shadow-2xl ring-4 ring-indigo-500/10' : 'shadow-sm'}`}
                                        >
                                            <div className="flex items-stretch min-h-[100px]">
                                                {/* Side Accent Bar */}
                                                <div className={`w-2.5 ${moduleStyle.bg} transition-all duration-500 ${isExpanded ? 'w-4 opacity-100' : 'w-2 opacity-80'}`}></div>

                                                <div className="flex-1 p-6 flex flex-col">
                                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                                        {/* Icon Box */}
                                                        <div className={`shrink-0 w-14 h-14 rounded-2xl ${moduleStyle.bg} text-white flex items-center justify-center text-2xl shadow-lg ${moduleStyle.shadow} group-hover:scale-105 transition-transform duration-300`}>
                                                            {moduleStyle.icon}
                                                        </div>

                                                        {/* Info Columns */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                <h4 className="text-lg font-bold text-white tracking-tight leading-none">
                                                                    {(log.action || "ACTION").replace(/_/g, " ")}
                                                                </h4>
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getActionColor(log.action || "")}`}>
                                                                    {log.module}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-300 capitalize">
                                                                <div className="flex items-center gap-1.5">
                                                                    <MdIcons.MdPerson className="text-indigo-400" size={16} />
                                                                    <span className="text-slate-100 font-bold">{log.userId?.name || "System"}</span>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <MdIcons.MdUpdate className="text-indigo-500" size={16} />
                                                                    <span>{new Date(log.createdAt).toLocaleString(undefined, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expand Toggle Icon */}
                                                        <div className={`hidden md:flex text-slate-300 transition-all duration-300 transform ${isExpanded ? 'rotate-90 text-indigo-600 scale-125' : 'group-hover:translate-x-1 group-hover:text-indigo-500'}`}>
                                                            <MdIcons.MdChevronRight size={32} />
                                                        </div>
                                                    </div>

                                                    {/* Preview Data (Shown only when collapsed) */}
                                                    {!isExpanded && log.details && typeof log.details === 'object' && (
                                                        <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
                                                            {Object.entries(log.details).slice(0, 3).map(([key, value]) => (
                                                                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-slate-300 border border-white/10">
                                                                    {key}: <span className="text-indigo-300 ml-1">{String(value)}</span>
                                                                </span>
                                                            ))}
                                                            {Object.keys(log.details).length > 3 && (
                                                                <span className="text-[10px] text-indigo-400 font-bold px-1">+ {Object.keys(log.details).length - 3} more</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Full Details Expansion */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                transition={{ duration: 0.3, ease: "circOut" }}
                                                                className="border-t border-white/10 pt-6 overflow-hidden"
                                                            >
                                                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 shadow-inner">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                        {log.details && typeof log.details === 'object' ? (
                                                                            Object.entries(log.details).map(([key, value]) => (
                                                                                <div key={key} className="flex flex-col group/item transition-all hover:translate-y-[-2px]">
                                                                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter mb-1">{key}</span>
                                                                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm font-semibold text-white break-words">
                                                                                        {String(value)}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="col-span-full">
                                                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter mb-1">Raw Details</span>
                                                                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm font-semibold text-white">{String(log.details)}</div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-8 text-[10px] font-bold text-slate-400">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="uppercase text-indigo-200">Tracking Reference</span>
                                                                            <span className="font-mono text-slate-200 bg-white/5 px-2 py-0.5 rounded border border-white/5">{log._id}</span>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="uppercase text-indigo-200">Identity Context</span>
                                                                            <span className="font-mono text-slate-200 bg-white/5 px-2 py-0.5 rounded border border-white/5">{log.userId?._id || 'SYSTEM_INTERNAL'}</span>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1 ml-auto">
                                                                            <span className="uppercase text-indigo-200">External Endpoint</span>
                                                                            <span className="font-mono text-slate-200 bg-white/5 px-2 py-0.5 rounded border border-white/5">{log.ipAddress || "0.0.0.0"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
