import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MdReceipt,
  MdArrowBack,
  MdTrendingUp,
  MdTrendingDown,
  MdPayments,
  MdAccountBalance,
  MdShield,
  MdLayers
} from "react-icons/md";

export default function SalaryPreview() {
  const { id } = useParams(); // profileId
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/salary-template/calculate/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data);
      } catch (err) {
        toast.error("Cloud computation failed");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [id, token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Projecting financial model...</p>
    </div>
  );

  if (!data) return (
    <div className="p-24 text-center">
      <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5">
        <MdLayers size={48} className="opacity-40" />
      </div>
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Simulation Failed</h3>
      <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Unable to generate salary projection for the provided entity reference.</p>
    </div>
  );

  const {
    templateName,
    earnings,
    deductions,
    netSalary,
    employeeCode
  } = data;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Structured Compensation</h1>
          <p className="text-slate-300 font-medium italic text-xs tracking-wide flex items-center gap-3">
            <span className="bg-indigo-500 text-white px-3 py-1 rounded-lg not-italic font-black text-[10px] tracking-widest uppercase">{employeeCode}</span>
            <span>Projected Analytics Forecast</span>
          </p>
        </div>

        <Link
          to={`/payroll-profile/${employeeCode}`}
          className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black px-8 py-4 rounded-2xl border border-white/10 shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <MdArrowBack size={20} className="text-indigo-400" />
          <span>Profile Context</span>
        </Link>
      </div>

      <div className="premium-card rounded-[40px] overflow-hidden p-8 lg:p-12 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="space-y-12">
          {/* Blueprint Info */}
          <div className="flex items-center gap-5 pb-10 border-b border-white/10 relative z-10">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-md text-indigo-400 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
              <MdReceipt size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-none mb-2">{templateName || "Modular Framework"}</h2>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Institutional Blueprint Protocol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* EARNINGS */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-lg">
                  <MdTrendingUp size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Gross Accruals</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Compensation</span>
                  <span className="text-sm font-black text-white font-mono tracking-tighter group-hover:text-indigo-300 transition-colors">
                    ₹{(earnings?.basic || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Regional Housing (HRA)</span>
                  <span className="text-sm font-black text-white font-mono tracking-tighter group-hover:text-indigo-300 transition-colors">
                    ₹{(earnings?.hra || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Flexible Allowances</span>
                  <span className="text-sm font-black text-white font-mono tracking-tighter group-hover:text-indigo-300 transition-colors">
                    ₹{(earnings?.allowances || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-black text-indigo-300/40 uppercase tracking-[0.3em]">Total Projection</span>
                  <span className="text-xl font-black text-emerald-400 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    ₹{(earnings?.grossSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shadow-lg">
                  <MdTrendingDown size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Statutory Outflow</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Provident Fund (PF)</span>
                  <span className="text-sm font-black text-white font-mono tracking-tighter group-hover:text-rose-300 transition-colors">
                    ₹{(deductions?.pf || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">State Insurance (ESI)</span>
                  <span className="text-sm font-black text-white font-mono tracking-tighter group-hover:text-rose-300 transition-colors">
                    ₹{(deductions?.esi || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Withholding Tax (TDS)</span>
                  <span className="text-sm font-black text-rose-400 font-mono tracking-tighter group-hover:animate-pulse transition-all">
                    ₹{(deductions?.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-black text-rose-300/40 uppercase tracking-[0.3em]">Total Deducted</span>
                  <span className="text-xl font-black text-rose-500 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                    ₹{(deductions?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NET HIGHLIGHT */}
          <div className="relative mt-16 p-12 bg-indigo-600 rounded-[40px] text-white flex flex-col md:flex-row md:items-center justify-between gap-10 overflow-hidden shadow-[0_25px_60px_rgba(79,70,229,0.4)] group/net">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover/net:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="relative flex items-center gap-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-indigo-100 border border-white/20 shadow-inner">
                <MdAccountBalance size={40} className="group-hover/net:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.3em] mb-3 opacity-80">Projected Final Disbursement</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-200 uppercase tracking-tighter">INR</span>
                  <h3 className="text-5xl lg:text-6xl font-black font-mono tracking-tighter drop-shadow-2xl">
                    ₹{(netSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-4 bg-black/10 px-8 py-5 rounded-[24px] border border-white/10 italic text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 backdrop-blur-md">
              <MdShield className="text-indigo-300 animate-pulse" size={24} />
              <div className="flex flex-col">
                <span className="leading-tight">Verified Protocol</span>
                <span className="text-[8px] opacity-60">Computational Match V2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
