import { useAuth } from "../context/AuthContext";
import {
    MdPerson,
    MdMailOutline,
    MdShield,
    MdBusiness,
    MdFingerprint,
    MdLayers,
    MdVerifiedUser
} from "react-icons/md";

export default function MyProfile() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-12">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-white tracking-tight">Identity Profile</h1>
                <p className="text-slate-300 font-medium mt-1">Manage your institutional credentials and organizational affiliation.</p>
            </div>

            <div className="premium-card rounded-[40px] overflow-hidden">
                {/* Hero Banner Area */}
                <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/30 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                </div>

                <div className="px-8 pb-10 -mt-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-3xl p-1 shadow-2xl border border-white/20">
                                <div className="w-full h-full bg-indigo-500/10 rounded-[22px] flex items-center justify-center text-indigo-300">
                                    <MdPerson size={64} />
                                </div>
                            </div>
                            <div className="pb-2">
                                <h2 className="text-3xl font-black text-white leading-tight">{user?.name}</h2>
                                <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 mt-2">
                                    <MdVerifiedUser className="text-emerald-400" size={16} />
                                    Institutional Protocol Verified
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pb-10 border-b border-white/10 uppercase tracking-widest text-[10px] font-black">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                            <span className="text-indigo-300 block">Primary Communication</span>
                            <div className="flex items-center gap-3 text-sm text-white normal-case font-bold mt-1">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300 shadow-sm border border-white/5">
                                    <MdMailOutline size={20} />
                                </div>
                                {user?.email}
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                            <span className="text-indigo-300 block">Institutional Designation</span>
                            <div className="flex items-center gap-3 text-sm text-white normal-case font-bold mt-1">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-amber-300 shadow-sm border border-white/5">
                                    <MdShield size={20} />
                                </div>
                                {user?.role?.replace("_", " ")}
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                            <span className="text-indigo-300 block">Organizational Identity</span>
                            <div className="flex items-center gap-3 text-sm text-white normal-case font-bold mt-1">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-emerald-300 shadow-sm border border-white/5">
                                    <MdBusiness size={20} />
                                </div>
                                OID: {user?.organizationId?.slice(-8).toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                            <span className="text-indigo-300 block">Entity Signature</span>
                            <div className="flex items-center gap-3 text-sm text-white normal-case font-bold mt-1">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300 shadow-sm border border-white/5">
                                    <MdFingerprint size={20} />
                                </div>
                                {user?._id?.slice(-12).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2 text-slate-500 italic text-[10px] font-bold">
                        <MdLayers size={14} className="text-indigo-500" />
                        <span className="text-slate-400">Your profile information is synchronized with institutional personnel records.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
