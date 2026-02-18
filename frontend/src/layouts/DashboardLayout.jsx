import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import * as MdIcons from "react-icons/md";

// New Components
import TopGlassBar from "../components/TopGlassBar";
import OverlayNavigation from "../components/OverlayNavigation";
import CommandPalette from "../components/CommandPalette";
import FloatingActionButton from "../components/FloatingActionButton";
import AtmosphericBackground from "../components/AtmosphericBackground";

export default function DashboardLayout() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false); // Can be managed by TopGlassBar or context if elevated
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showOverlayMenu, setShowOverlayMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Override browser back button to always go to dashboard
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard', { replace: true });
      } else {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);

  // Command Palette keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden font-inter relative">
      {/* --- UNIFIED ATMOSPHERIC BACKGROUND --- */}
      <AtmosphericBackground />

      {/* --- FLOATING TOP BAR --- */}
      <TopGlassBar
        onMenuClick={() => setShowOverlayMenu(true)}
        onSearchClick={() => setShowCommandPalette(true)}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
        unreadCount={unreadCount}
      />

      {/* --- FULL SCREEN OVERLAY MENU --- */}
      <OverlayNavigation
        isOpen={showOverlayMenu}
        onClose={() => setShowOverlayMenu(false)}
      />

      {/* --- COMMAND PALETTE --- */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden pt-24">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* --- FLOATING ACTION BUTTON --- */}
      <FloatingActionButton />

      {/* Notifications Dropdown */}
      <motion.div initial={false}>
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed top-24 right-4 sm:right-20 w-[90vw] sm:w-[400px] bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] z-[70] overflow-hidden flex flex-col max-h-[500px]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/40 bg-white/20 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                      <MdIcons.MdNotifications size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 tracking-tight">Intelligence Hub</h3>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Protocol Updates</p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-rose-500 text-white px-3 py-1 rounded-full shadow-lg shadow-rose-500/20">{unreadCount} New</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex-1 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark All Read
                  </button>
                  <button
                    onClick={clearAll}
                    disabled={notifications.length === 0}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto custom-scrollbar flex-1 p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                      <MdIcons.MdHistory size={40} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Neural link clear</p>
                    <p className="text-slate-300 text-xs mt-1">No active protocols detected</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      layout
                      key={notif._id}
                      onClick={() => markAsRead(notif._id)}
                      className={`relative overflow-hidden group p-4 rounded-2xl border transition-all cursor-pointer ${!notif.read
                        ? "bg-white/60 border-indigo-100 shadow-lg shadow-indigo-500/5"
                        : "bg-white/20 border-white/40 opacity-70 hover:opacity-100"
                        }`}
                    >
                      {!notif.read && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-bl-xl"></div>
                      )}

                      <div className="flex gap-4 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${notif.type === 'PAYROLL'
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/20'
                          : notif.type === 'PAYSLIP'
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/20'
                            : 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-500/20'
                          } text-white`}>
                          {notif.type === 'PAYROLL' ? <MdIcons.MdAccountBalanceWallet size={24} /> :
                            notif.type === 'PAYSLIP' ? <MdIcons.MdReceipt size={24} /> :
                              <MdIcons.MdMemory size={24} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm tracking-tight text-slate-800 ${!notif.read ? 'font-black' : 'font-bold'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-medium leading-relaxed uppercase tracking-tight">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <MdIcons.MdAccessTime size={10} className="text-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-white/40 shrink-0">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[2px] hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Close Secure Link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
