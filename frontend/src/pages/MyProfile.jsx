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
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Identity Profile</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your institutional credentials and organizational affiliation.</p>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                {/* Hero Banner Area */}
                <div className="h-32 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                </div>

                <div className="px-8 pb-10 -mt-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl shadow-indigo-600/10">
                                <div className="w-full h-full bg-slate-50 rounded-[22px] flex items-center justify-center text-indigo-600 border border-slate-100">
                                    <MdPerson size={56} />
                                </div>
                            </div>
                            <div className="pb-2">
                                <h2 className="text-2xl font-black text-slate-800 leading-tight">{user?.name}</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 mt-1">
                                    <MdVerifiedUser className="text-emerald-500" size={14} />
                                    Authenticated Access
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pb-10 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                            <span className="text-slate-400 block">Primary Communication</span>
                            <div className="flex items-center gap-3 text-sm text-slate-700 normal-case font-bold mt-1">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <MdMailOutline size={18} />
                                </div>
                                {user?.email}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                            <span className="text-slate-400 block">Institutional Designation</span>
                            <div className="flex items-center gap-3 text-sm text-slate-700 normal-case font-bold mt-1">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                                    <MdShield size={18} />
                                </div>
                                {user?.role?.replace("_", " ")}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                            <span className="text-slate-400 block">Organizational Identity</span>
                            <div className="flex items-center gap-3 text-sm text-slate-700 normal-case font-bold mt-1">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                    <MdBusiness size={18} />
                                </div>
                                OID: {user?.organizationId?.slice(-8).toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                            <span className="text-slate-400 block">Entity Signature</span>
                            <div className="flex items-center gap-3 text-sm text-slate-700 normal-case font-bold mt-1">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <MdFingerprint size={18} />
                                </div>
                                {user?._id?.slice(-12).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2 text-slate-400 italic text-[10px] font-bold">
                        <MdLayers size={14} className="text-indigo-400" />
                        <span>Your profile information is synchronized with institutional personnel records.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
