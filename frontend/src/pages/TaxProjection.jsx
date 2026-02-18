import { useState } from "react";
import { toast } from "react-hot-toast";
import { getProjection } from "../services/taxService";
import {
  MdCalculate,
  MdCalendarToday,
  MdShield,
  MdTrendingUp,
  MdAttachMoney,
  MdAccountBalance,
  MdLayers,
  MdArrowForward
} from "react-icons/md";
import Dropdown from "../components/Dropdown";

export default function TaxProjection() {
  const [financialYear, setFinancialYear] = useState("");
  const [regime, setRegime] = useState("old");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjection = async () => {
    try {
      setLoading(true);
      const data = await getProjection({ financialYear, regime });
      setResult(data);
      toast.success("Projection synchronized");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cloud computation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-3 leading-none uppercase">Forecast Center</h1>
          <p className="text-slate-400 font-medium italic text-sm tracking-wide">Projected tax liabilities based on active statutory slabs and declared investments.</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-6 py-3 rounded-2xl border border-indigo-500/20 shadow-2xl backdrop-blur-md">
          <MdCalculate size={20} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Projection Engine Active</span>
        </div>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/10 relative z-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-indigo-400 shadow-inner">
            <MdCalculate size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-1 leading-none">Compute Intelligence</h2>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Initialize Statutory Forecast</p>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Institutional Cycle</label>
              <div className="relative group">
                <MdCalendarToday className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={24} />
                <input
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white font-mono tracking-widest text-xs shadow-inner"
                  placeholder="e.g. 2024-25"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Statutory Protocol</label>
              <div className="relative group">
                <MdShield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors z-10 pointer-events-none" size={24} />
                <Dropdown
                  options={[
                    { value: "old", label: "🏛️ Standard Architecture (Old Regime)" },
                    { value: "new", label: "✨ Simplified Architecture (New Regime)" }
                  ]}
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button
            onClick={fetchProjection}
            disabled={loading}
            className="group relative w-full inline-flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-xs overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {loading ? (
              <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <MdTrendingUp size={24} className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Synchronize Forecast Architecture</span>
              </>
            )}
          </button>

          {/* Result Highlight */}
          {result && (
            <div className="mt-14 animate-in slide-in-from-bottom-8 duration-700">
              <div className="relative p-12 bg-white/5 backdrop-blur-3xl rounded-[48px] text-white border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 shadow-2xl">
                        <MdAccountBalance size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Aggregated Fiscal Liability</p>
                        <h3 className="text-4xl lg:text-5xl font-black font-mono tracking-tighter text-white">₹{result.projectedTax?.toLocaleString()}</h3>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl flex flex-col items-end">
                      <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Entity Signature</span>
                      <span className="text-xs font-black text-white font-mono">{result.employeeCode} / FY {financialYear || "ACTIVE"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Internal Accrual</p>
                      </div>
                      <p className="text-2xl font-black font-mono tracking-tighter text-white">₹{result.totalIncome?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Exempt Yield</p>
                      </div>
                      <p className="text-2xl font-black font-mono tracking-tighter text-emerald-400 text-shadow-[0_0_20px_rgba(52,211,153,0.3)]">₹{result.investments?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2 md:text-right">
                      <div className="flex items-center gap-2 mb-2 justify-end">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Net Threshold</p>
                      </div>
                      <p className="text-2xl font-black font-mono tracking-tighter text-indigo-300">₹{result.taxableIncome?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-slate-500 italic text-[10px] font-black uppercase tracking-[0.2em]">
                    <MdShield size={16} className="text-emerald-500 opacity-50" />
                    <span>Statutory Validation: {result.selectedRegime?.toUpperCase()} Architecture</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
