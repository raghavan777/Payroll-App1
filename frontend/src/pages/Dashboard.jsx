import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

export default function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/users/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({ users: res.data.totalUsers });
      } catch (err) {
        setStats({ users: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

      {/* --- STATS GRID --- */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-10 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
              <MdTrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Computational Vectors</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time Performance Metrics</p>
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

      {/* --- SECONDARY SECTION --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[56px] p-12 border border-slate-200 shadow-sm relative group h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 group-hover:bg-indigo-50/50 transition-colors duration-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                    <MdSystemUpdateAlt size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Engine Heartbeat</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  />
                  System Nominal
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Cloud Infrastructure', status: '99.99%', sub: 'Latency: 14ms', icon: 'API', color: 'indigo' },
                  { label: 'Statutory Engine', status: 'Active', sub: 'v4.2.0-stable', icon: 'DB', color: 'emerald' },
                  { label: 'Security Firewall', status: 'Rigorous', sub: 'Last Scan: 2m ago', icon: 'SH', color: 'rose' },
                  { label: 'Audit Pipeline', status: 'Synchronized', sub: '0x8F2E...44B3', icon: 'AD', color: 'amber' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-${item.color}-100/50 text-${item.color}-600 rounded-2xl flex items-center justify-center font-black text-xs tracking-widest group-hover/item:scale-110 transition-transform`}>{item.icon}</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm mb-1">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black text-${item.color}-600 bg-${item.color}-50 px-3 py-1.5 rounded-full uppercase tracking-tighter border border-${item.color}-100`}>{item.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group h-full border border-white/5">
          <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-[-10%] left-[-10%] w-full h-64 bg-indigo-600/10 rounded-full blur-[80px]"
          />

          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 tracking-tight">
            <MdLayers className="text-indigo-400" />
            Active Protocols
          </h3>

          <div className="space-y-4 relative z-10">
            {[
              { icon: <MdPeople className="text-indigo-400" />, label: "Manage Workforce", path: "/employees" },
              { icon: <MdAttachMoney className="text-emerald-400" />, label: "Execute Payroll", path: "/run-payroll" },
              { icon: <MdReceipt className="text-amber-400" />, label: "Financial Archives", path: "/payroll-history" },
              { icon: <MdPerson className="text-sky-400" />, label: "Identity Matrix", path: "/my-profile" },
            ].map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 10 }}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-indigo-600/20 p-6 rounded-[32px] transition-all group backdrop-blur-sm border border-white/5"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <span className="font-black text-[12px] text-slate-400 group-hover:text-white uppercase tracking-[0.2em]">{action.label}</span>
                </div>
                <MdArrowForward className="text-slate-600 group-hover:text-white transition-transform group-hover:translate-x-2" />
              </motion.button>
            ))}
          </div>

          <div className="mt-12 p-8 bg-white/5 rounded-[32px] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <MdVerifiedUser className="text-emerald-400" size={28} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              Identity Matrix Verified.<br />Institutional Access: <span className="text-white">{role}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ==================== REUSABLE WIDGET ===================== */

function Widget({ icon, title, value, gradient, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer relative overflow-hidden group 
      bg-white border border-slate-200 rounded-[48px] p-10 
      shadow-sm hover:shadow-2xl transition-all duration-500 h-full`}
    >
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700`}></div>
      <div className="relative z-10 flex flex-col gap-10">
        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-2xl shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-[0.3em] leading-none mb-4">{title}</p>
          <p className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
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
