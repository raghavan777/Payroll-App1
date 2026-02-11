import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import {
    MdBusiness,
    MdPublic,
    MdLanguage,
    MdPlace,
    MdPayment,
    MdSave,
    MdInfoOutline,
    MdLayers,
    MdShield
} from "react-icons/md";

export default function Settings() {
    const [org, setOrg] = useState({
        name: "",
        country: "",
        domain: "",
        address: "",
        timezone: "Asia/Kolkata",
        currency: "INR"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const res = await api.get("/api/organization");
                setOrg(res.data);
            } catch (err) {
                toast.error("Failed to load organization settings");
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/api/organization", org);
            toast.success("Institutional parameters synchronized");
        } catch (err) {
            toast.error("Update failed: Internal synchronization error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold tracking-tight">Syncing administrative data...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Institutional Configuration</h1>
                <p className="text-slate-500 font-medium mt-1">Configure global organization parameters and regional compliance settings.</p>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Profile Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                            <MdBusiness size={48} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{org.name || "Enterprise Identity"}</h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                            <MdPublic size={14} />
                            {org.domain || "Internal Link"}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <MdShield className="text-indigo-400 mb-4" size={32} />
                        <h4 className="text-lg font-black mb-1">Data Governance</h4>
                        <p className="text-indigo-200 text-xs font-medium leading-relaxed opacity-80">All administrative changes are logged for institutional auditing and compliance verification.</p>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 lg:p-10">
                        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <MdLayers size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 leading-none mb-1">Administrative Details</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Framework</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Entity Name</label>
                                <div className="relative">
                                    <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300"
                                        value={org.name}
                                        onChange={e => setOrg({ ...org, name: e.target.value })}
                                        placeholder="e.g. Acme Corp Institutional"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Jurisdiction</label>
                                <div className="relative">
                                    <MdLanguage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300"
                                        value={org.country}
                                        onChange={e => setOrg({ ...org, country: e.target.value })}
                                        placeholder="e.g. India"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fiscal Currency</label>
                                <div className="relative">
                                    <MdPayment className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 appearance-none bg-no-repeat bg-[right_1rem_center]"
                                        value={org.currency}
                                        onChange={e => setOrg({ ...org, currency: e.target.value })}
                                    >
                                        <option value="INR">INR (Statutory ₹)</option>
                                        <option value="USD">USD (Institutional $)</option>
                                        <option value="EUR">EUR (Global €)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Registered Address</label>
                                <div className="relative">
                                    <MdPlace className="absolute left-4 top-6 text-slate-400" size={20} />
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner placeholder:text-slate-300"
                                        rows="4"
                                        value={org.address}
                                        onChange={e => setOrg({ ...org, address: e.target.value })}
                                        placeholder="Institutional HQ Location"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-3 text-slate-400 italic">
                                <MdInfoOutline size={20} className="text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Changes take effect immediately upon synchronization.</span>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-slate-800 text-white font-black px-10 py-5 rounded-[24px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <MdSave size={24} className="group-hover:translate-y-px" />
                                        <span>Update Parameters</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
