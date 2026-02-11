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
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center md:text-left">Fiscal Forecasting</h1>
        <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Projected tax liabilities based on active statutory slabs and declared investments.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MdCalculate size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none mb-1">Projection Engine</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compute Liabilities</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Financial Year</label>
              <div className="relative">
                <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="e.g. 2024-25"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Statutory Regime</label>
              <div className="relative">
                <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                >
                  <option value="old">Statutory (Old Regime)</option>
                  <option value="new">Simplified (New Regime)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={fetchProjection}
            disabled={loading}
            className="group w-full inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-slate-800 text-white font-black px-12 py-5 rounded-[28px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <MdTrendingUp size={24} className="group-hover:translate-y-px" />
                <span>Synchronize Forecast</span>
              </>
            )}
          </button>

          {/* Result Highlight */}
          {result && (
            <div className="mt-12 animate-in slide-in-from-bottom-6 duration-500">
              <div className="relative p-10 bg-indigo-900 rounded-[32px] text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <div className="relative space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-indigo-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300">
                        <MdAccountBalance size={28} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">Fiscal Liability</p>
                        <h3 className="text-3xl font-black font-mono tracking-tighter">₹{result.projectedTax?.toLocaleString()}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Entity Signature</span>
                      <span className="text-sm font-black text-indigo-100">{result.employeeCode} / {financialYear || "FY Active"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Internal Accrual</p>
                      <p className="text-xl font-black font-mono tracking-tighter">₹{result.totalIncome?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Exempt Investments</p>
                      <p className="text-xl font-black font-mono tracking-tighter text-emerald-400">₹{result.investments?.toLocaleString()}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Taxable Threshold</p>
                      <p className="text-xl font-black font-mono tracking-tighter text-indigo-200">₹{result.taxableIncome?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-center gap-2 text-indigo-400 italic text-[10px] font-bold">
                    <MdShield size={14} />
                    <span>Validated against statutory slabs for {result.selectedRegime?.toUpperCase()} system.</span>
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
