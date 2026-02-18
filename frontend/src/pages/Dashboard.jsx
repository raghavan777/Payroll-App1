import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  MdPeople,
  MdAttachMoney,
  MdAccessTime,
  MdAnalytics,
  MdAccountBalance,
  MdBusiness,
  MdPendingActions,
  MdReceipt,
  MdPerson,
  MdTrendingUp,
  MdArrowForward,
  MdShield,
  MdVerifiedUser,
  MdLayers,
  MdSystemUpdateAlt
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavigationCards from "../components/DashboardNavigationCards";
import * as MdIcons from "react-icons/md";

export default function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Stats
        const statsRes = await api.get("/api/users/stats");
        setStats({ users: statsRes.data.totalUsers });

        // Fetch Recent Activity (Audit logs) if SUPER_ADMIN
        if (role === "SUPER_ADMIN" || user?.role === "SUPER_ADMIN") {
          const logsRes = await api.get("/api/audit");
          setRecentLogs(logsRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const currentRole = role || "EMPLOYEE";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-16 font-inter"
    >
      {/* --- HERO SECTION --- */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-[#020617] rounded-[56px] p-10 lg:p-20 text-white shadow-2xl shadow-indigo-600/10 border border-white/5"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full -mr-40 -mt-40 blur-[120px]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full -ml-20 -mb-20 blur-[100px]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 mb-10"
            >
              <MdShield className="text-indigo-400" size={16} />
              <span>Institutional Protocol Level 4 • Active</span>
            </motion.div>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.95] text-gradient">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-xl opacity-80">
              The institutional engine is synchronized. Your current payroll vectors and statutory compliance targets are live.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => navigate("/reports")}
              className="group relative px-10 py-6 bg-white text-slate-900 font-black rounded-[32px] hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 overflow-hidden flex items-center gap-4 text-lg"
            >
              <MdAnalytics size={28} className="text-indigo-600" />
              Institutional Intelligence
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* --- QUICK NAVIGATION CARDS --- */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-4 mb-8 px-4">
          <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center">
            <MdIcons.MdApps size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Quick Access</h2>
        </div>
        <DashboardNavigationCards />
      </motion.section>

      {/* --- STATS GRID --- */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-10 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
              <MdTrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Computational Vectors</h2>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Real-time Performance Metrics</p>
            </div>
          </div>
          <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-white hover:shadow-sm px-6 py-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">Audit Insights</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentRole === "SUPER_ADMIN" && <SuperAdminWidgets stats={stats} navigate={navigate} />}
          {currentRole === "HR_ADMIN" && <HRWidgets navigate={navigate} />}
          {currentRole === "EMPLOYEE" && <EmployeeWidgets navigate={navigate} />}
        </div>
      </motion.section>

      {/* --- UNIFIED SINGLE-LAYOUT COMMAND CENTER --- */}
      <motion.div variants={itemVariants} className="relative group overflow-hidden bg-slate-900 rounded-[64px] shadow-2xl border border-white/5 p-10 lg:p-14">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-pink-600/10 opacity-50"></div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 space-y-16">
          {/* Section: Engine Heartbeat */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <MdSystemUpdateAlt size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Engine Heartbeat</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time core diagnostics</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-inner">
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                />
                Nominal
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Cloud Infrastructure', status: '99.99%', sub: 'Latency: 14ms', icon: <MdIcons.MdCloudDone className="text-indigo-400" /> },
                { label: 'Statutory Engine', status: 'Active', sub: 'v4.2.0-stable', icon: <MdIcons.MdSettingsRemote className="text-emerald-400" /> },
                { label: 'Security Firewall', status: 'Rigorous', sub: 'Last Scan: 2m ago', icon: <MdIcons.MdSecurity className="text-rose-400" /> },
                { label: 'Audit Pipeline', status: 'Synchronized', sub: '0x8F2E...44B3', icon: <MdIcons.MdTimeline className="text-amber-400" /> }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="flex flex-col p-8 bg-white/5 rounded-[40px] border-2 border-white/5 group-hover/item:border-white/20 transition-all duration-500 group/item h-full relative overflow-hidden shadow-xl group-hover/item:shadow-2xl"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-20 transition-all duration-700 ${item.label.includes('Cloud') ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                      item.label.includes('Statutory') ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        item.label.includes('Security') ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
                          'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}></div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover/item:scale-125 group-hover/item:rotate-6 transition-all duration-500">{item.icon}</div>
                    <div className="flex-1">
                      <p className="font-black text-white text-[15px] mb-1 group-hover/item:scale-105 origin-left transition-transform duration-300">{item.label}</p>
                      <p className="text-[10px] text-slate-400 group-hover/item:text-white/80 font-bold uppercase tracking-widest leading-relaxed transition-colors duration-300">{item.sub}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/40 group-hover/item:text-white/60 uppercase tracking-widest transition-colors">Status</span>
                      <span className={`text-[10px] font-black text-white bg-white/10 group-hover/item:bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-tighter border border-white/10 group-hover/item:border-white/30 shadow-sm transition-all duration-300`}>{item.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

          {/* Section: Active Protocols */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <MdLayers size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Active Protocols</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional action vectors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <MdPeople className="text-indigo-400" />, label: "Workforce", path: "/employees", color: "indigo" },
                { icon: <MdAttachMoney className="text-emerald-400" />, label: "Payroll", path: "/run-payroll", color: "emerald" },
                { icon: <MdReceipt className="text-amber-400" />, label: "Archives", path: "/payroll-history", color: "amber" },
                { icon: <MdPerson className="text-sky-400" />, label: "Identity", path: "/my-profile", color: "sky" },
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -12, scale: 1.03 }}
                  onClick={() => navigate(action.path)}
                  className="w-full flex-col flex items-start p-8 bg-white/5 rounded-[40px] transition-all group border-2 border-white/5 group-hover:border-white/20 h-full text-left relative overflow-hidden shadow-xl group-hover:shadow-2xl duration-500"
                >
                  {/* Colorful gradient overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700 ${action.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                      action.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        action.color === 'amber' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                          'bg-gradient-to-br from-sky-500 to-cyan-600'
                    }`}></div>

                  <div className="relative z-10 w-full">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-125 group-hover:bg-white/15 group-hover:rotate-6 transition-all duration-500">{action.icon}</div>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-[13px] text-white group-hover:scale-105 origin-left uppercase tracking-[0.2em] transition-transform duration-300">{action.label}</span>
                      <MdArrowForward className="text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-2" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Footer of unified hub */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[32px] border border-white/5 w-full md:w-auto">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                <MdVerifiedUser className="text-indigo-400" size={32} />
              </div>
              <div>
                <p className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Authorization Matrix</p>
                <p className="text-white font-bold text-xs uppercase tracking-tight">{role} Access • Active</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <span className="animate-pulse flex h-2 w-2 rounded-full bg-indigo-500"></span>
              Secure Institutional Link Established
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- RECENT ACTIVITY SECTION --- */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white/40 backdrop-blur-2xl rounded-[56px] p-12 border border-white/50 shadow-xl relative overflow-hidden h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center">
                <MdIcons.MdHistory size={24} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Recent Activity</h3>
            </div>
            <button onClick={() => navigate('/audit-logs')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="space-y-6">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, idx) => (
                <div key={log._id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/audit-logs')}>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${idx === 0 ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-300'}`}></div>
                    {idx !== recentLogs.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-white leading-none group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-[11px] text-slate-300 font-medium mt-1">{log.userId?.name || 'System'} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm font-medium italic">No recent activities recorded.</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-black tracking-tighter mb-6 leading-tight">Institutional Pulse</h3>
            <p className="text-indigo-100/80 font-medium mb-10 text-lg">The workforce ecosystem is currently operating at <span className="text-white font-black underline decoration-emerald-400 underline-offset-8">Peak Efficiency</span>. All statutory nodes are synchronized.</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Efficiency</p>
                <p className="text-3xl font-black">98.2%</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Compliance</p>
                <p className="text-3xl font-black">100%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

/* ==================== REUSABLE WIDGET ===================== */

function Widget({ icon, title, value, gradient, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -16, scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`cursor-pointer relative overflow-hidden group 
      premium-card border-2 border-white/5 group-hover:border-white/20 shadow-2xl shadow-indigo-600/5 group-hover:shadow-[0_25px_70px_-15px] p-10 h-full transition-all duration-500`}
    >
      {/* Full Card Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-25 transition-all duration-700 ease-out`}></div>

      {/* Top Right Radial Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-40 group-hover:scale-150 transition-all duration-700 blur-3xl`}></div>

      {/* Bottom Left Accent Glow */}
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 bg-gradient-to-tr ${gradient} opacity-0 group-hover:opacity-25 transition-all duration-700 delay-75 blur-2xl`}></div>

      <div className="relative z-10 flex flex-col gap-10">
        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-2xl group-hover:shadow-[0_20px_60px_-10px] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-indigo-300 group-hover:text-white transition-colors uppercase tracking-[0.4em] leading-none mb-4">{title}</p>
          <p className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none group-hover:scale-105 origin-left transition-transform duration-300">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= ROLE SPECIFIC WIDGETS ====================== */

function SuperAdminWidgets({ stats, navigate }) {
  return (
    <>
      <Widget icon={<MdBusiness size={40} />} title="Org Status" value="Healthy" gradient="from-indigo-600 to-indigo-800" />
      <Widget icon={<MdPeople size={40} />} title="Total Pulse" value={stats.users} gradient="from-blue-600 to-sky-700" onClick={() => navigate("/employees")} />
      <Widget icon={<MdAttachMoney size={40} />} title="Fiscal Engine" value="Active" gradient="from-fuchsia-600 to-pink-700" />
      <Widget icon={<MdAnalytics size={40} />} title="Compliance" value="Synced" gradient="from-emerald-600 to-teal-700" />
    </>
  );
}

function HRWidgets({ navigate }) {
  return (
    <>
      <Widget icon={<MdAccessTime size={40} />} title="Presence Log" value="94.2%" gradient="from-indigo-600 to-violet-700" />
      <Widget icon={<MdAttachMoney size={40} />} title="Payroll Status" value="Ready" gradient="from-emerald-600 to-teal-700" onClick={() => navigate("/run-payroll")} />
      <Widget icon={<MdPendingActions size={40} />} title="Matrix Req." value="12 New" gradient="from-amber-600 to-orange-700" />
      <Widget icon={<MdAccountBalance size={40} />} title="Statutory Hub" value="Filed" gradient="from-blue-600 to-sky-700" onClick={() => navigate("/statutory")} />
    </>
  );
}

function EmployeeWidgets({ navigate }) {
  return (
    <>
      <Widget icon={<MdReceipt size={40} />} title="Net Comp" value="₹74,250" gradient="from-emerald-600 to-teal-700" onClick={() => navigate("/payroll-history")} />
      <Widget icon={<MdAccessTime size={40} />} title="Engage Hours" value="160.5" gradient="from-indigo-600 to-violet-700" />
      <Widget icon={<MdAccountBalance size={40} />} title="Fiscal Credits" value="8/12" gradient="from-amber-600 to-orange-700" />
      <Widget icon={<MdPerson size={40} />} title="Identity Rank" value="L4 Spec." gradient="from-blue-600 to-sky-700" />
    </>
  );
}
