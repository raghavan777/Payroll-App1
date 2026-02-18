import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as MdIcons from "react-icons/md";
import { motion } from "framer-motion";

export default function TopGlassBar({ onMenuClick, onSearchClick, onNotificationsClick, unreadCount }) {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50"
        >
            <div className="bg-white/60 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-8 py-3.5 flex items-center justify-between">

                {/* Left: Logo */}
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-500/30 group-hover:rotate-6 transition-all duration-300">
                        P
                    </div>
                    <span className="hidden sm:block font-black text-slate-800 text-xl tracking-tighter">
                        Payroll<span className="text-indigo-600">Pro</span>
                    </span>
                </div>

                {/* Center: Search Trigger */}
                <button
                    onClick={onSearchClick}
                    className="hidden lg:flex items-center gap-4 px-8 py-3 bg-white/50 hover:bg-white/80 border border-white/40 hover:border-indigo-200/50 rounded-full text-slate-600 hover:text-indigo-600 transition-all group w-80 shadow-sm"
                >
                    <MdIcons.MdSearch size={22} className="group-hover:scale-110 transition-transform text-indigo-500" />
                    <span className="text-sm font-bold tracking-tight">Search Protocols...</span>
                    <kbd className="ml-auto text-[10px] font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 shadow-sm">⌘K</kbd>
                </button>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <button
                        onClick={onNotificationsClick}
                        className="p-3.5 rounded-2xl hover:bg-indigo-600/10 hover:text-indigo-600 transition-all text-slate-600 relative group"
                    >
                        <MdIcons.MdNotifications size={26} className="group-hover:scale-110 transition-transform" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                        )}
                    </button>

                    <div className="h-10 w-px bg-slate-200/50 hidden sm:block"></div>

                    <div className="hidden sm:flex items-center gap-4 pl-2 cursor-pointer group" onClick={onMenuClick}>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{user?.name?.split(' ')[0]}</span>
                            <span className="text-[9px] font-black text-indigo-500/80 uppercase tracking-widest leading-none">Status: Active</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                                <MdIcons.MdPerson size={28} className="text-indigo-500/40" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onMenuClick}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                    >
                        <MdIcons.MdMenu size={26} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
