import { useState } from "react";
import { secureAction } from "../utils/secureAction";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  MdPayments,
  MdPlayCircleFilled,
  MdShield,
  MdReceipt,
  MdCheckCircle,
  MdError,
  MdAutoGraph
} from "react-icons/md";

export default function Payroll() {
  const { hasPermission } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);

  const runPayroll = async () => {
    if (!hasPermission("run_payroll")) {
      return setStatus({ type: "error", msg: "Authorization required for computation cycle." });
    }

    setIsRunning(true);
    setStatus(null);

    try {
      const res = await secureAction((extraHeaders = {}) =>
        axios.post(
          "http://localhost:5000/api/payroll/run",
          {},
          { headers: extraHeaders, withCredentials: true }
        )
      );

      setStatus({ type: "success", msg: res.data?.message || "Computation cycle finalized successfully!" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Internal failure during processing"
      });
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden premium-card rounded-[40px] p-8 lg:p-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/20 mb-10 animate-in zoom-in-50 duration-700 border border-white/20">
            <MdPayments size={48} />
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">Centralized Payroll Engine</h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed mb-12">
            Orchestrate enterprise-wide compensation cycles, automated statutory deductions, and high-fidelity payslip generation with a single protocol.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 text-left">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
              <MdAutoGraph className="text-indigo-400 mb-4" size={28} />
              <h4 className="font-black text-white text-[10px] mb-2 uppercase tracking-[0.2em]">Dynamic Math</h4>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed">Real-time computation of variable earnings and offsets.</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
              <MdShield className="text-emerald-400 mb-4" size={28} />
              <h4 className="font-black text-white text-[10px] mb-2 uppercase tracking-[0.2em]">Compliant</h4>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed">Auto-enforcement of regional tax governance policies.</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
              <MdReceipt className="text-amber-400 mb-4" size={28} />
              <h4 className="font-black text-white text-[10px] mb-2 uppercase tracking-[0.2em]">Ledger Ready</h4>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed">Instant synchronization with historical financial records.</p>
            </div>
          </div>

          {status && (
            <div
              className={`w-full p-6 mb-10 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border backdrop-blur-xl ${status.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
            >
              {status.type === "success" ? <MdCheckCircle size={32} /> : <MdError size={32} />}
              <span className="font-black uppercase tracking-widest text-xs">{status.msg}</span>
            </div>
          )}

          <button
            onClick={runPayroll}
            disabled={isRunning}
            className={`group relative inline-flex items-center gap-3 px-16 py-6 rounded-full text-lg font-black tracking-widest uppercase transition-all active:scale-95 shadow-[0_20px_50px_rgba(79,70,229,0.3)] disabled:opacity-50 overflow-hidden ${isRunning
              ? "bg-white/10 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isRunning ? (
              <>
                <span className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></span>
                <span className="relative z-10 text-xs">Synchronizing Protocol...</span>
              </>
            ) : (
              <>
                <MdPlayCircleFilled size={28} className="relative z-10" />
                <span className="relative z-10 text-xs">Execute Unified Cycle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Institutional Note */}
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <MdShield size={16} className="text-indigo-400" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Validated Financial Environment • Protocol AES-256 Verified</p>
      </div>
    </div>
  );
}
