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
      <div className="relative overflow-hidden bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 lg:p-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

        <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-8 animate-in zoom-in-50 duration-500">
            <MdPayments size={40} />
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight mb-4">Centralized Payroll Engine</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
            Orchestrate enterprise-wide compensation cycles, automated statutory deductions, and high-fidelity payslip generation with a single directive.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 text-left">
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
              <MdAutoGraph className="text-indigo-500 mb-3" size={24} />
              <h4 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-wider">Dynamic Math</h4>
              <p className="text-slate-500 text-xs font-medium">Real-time computation of variable earnings and offsets.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
              <MdShield className="text-emerald-500 mb-3" size={24} />
              <h4 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-wider">Compliant</h4>
              <p className="text-slate-500 text-xs font-medium">Auto-enforcement of regional tax governance policies.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
              <MdReceipt className="text-amber-500 mb-3" size={24} />
              <h4 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-wider">Ledger Ready</h4>
              <p className="text-slate-500 text-xs font-medium">Instant synchronization with historical financial records.</p>
            </div>
          </div>

          {status && (
            <div
              className={`w-full p-5 mb-8 rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 border ${status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100"
                }`}
            >
              {status.type === "success" ? <MdCheckCircle size={28} /> : <MdError size={28} />}
              <span className="font-bold text-sm">{status.msg}</span>
            </div>
          )}

          <button
            onClick={runPayroll}
            disabled={isRunning}
            className={`group relative inline-flex items-center gap-3 px-12 py-5 rounded-[28px] text-lg font-black tracking-tight transition-all active:scale-95 shadow-2xl shadow-indigo-600/20 disabled:opacity-50 ${isRunning
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
          >
            {isRunning ? (
              <>
                <span className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></span>
                <span>Synchronizing Data...</span>
              </>
            ) : (
              <>
                <MdPlayCircleFilled size={28} />
                <span>Execute Unified Cycle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Institutional Note */}
      <div className="flex items-center justify-center gap-2 text-slate-400">
        <MdShield size={16} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Validated Financial Environment • ISO 27001 Protocol</p>
      </div>
    </div>
  );
}
