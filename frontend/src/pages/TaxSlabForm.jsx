import { useState } from "react";
import { toast } from "react-hot-toast";
import { createSlab } from "../services/taxService";
import {
  MdReceiptLong,
  MdAdd,
  MdRemoveCircleOutline,
  MdSave,
  MdCalendarToday,
  MdShield,
  MdTrendingUp,
  MdLayers
} from "react-icons/md";

const emptySlab = { min: "", max: "", rate: "" };

export default function TaxSlabForm() {
  const [regime, setRegime] = useState("old");
  const [financialYear, setFinancialYear] = useState("");
  const [slabs, setSlabs] = useState([{ ...emptySlab }]);
  const [loading, setLoading] = useState(false);

  const updateSlab = (index, key, value) => {
    const next = [...slabs];
    next[index][key] = value;
    setSlabs(next);
  };

  const addSlab = () => setSlabs((prev) => [...prev, { ...emptySlab }]);
  const removeSlab = (index) => setSlabs((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        regime,
        financialYear,
        slabs: slabs.map((s) => ({
          min: Number(s.min || 0),
          max: s.max === "" ? null : Number(s.max),
          rate: Number(s.rate || 0),
        })),
      };
      await createSlab(payload);
      toast.success("Progressive tax structure saved!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Configuration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Income Tax Governance</h1>
          <p className="text-slate-500 font-medium mt-1">Configure progressive tax slabs and institutional regimes.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 italic text-xs font-bold">
          <MdShield size={16} />
          <span>Regulatory Compliant</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Regime & Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Taxation Regime</label>
              <div className="relative group">
                <MdLayers size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 appearance-none"
                >
                  <option value="old">Unified (Old Regime)</option>
                  <option value="new">Standardized (New Regime)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Financial Cycle</label>
              <div className="relative group">
                <MdCalendarToday size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. 2025-2026"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Slab Rows */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">Progressive Slabs</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Income Brackets & Rates</p>
              </div>
              <button
                type="button"
                onClick={addSlab}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                <MdAdd size={18} />
                <span>Insert Bracket</span>
              </button>
            </div>

            <div className="space-y-4">
              {slabs.map((slab, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 border border-slate-100 p-6 rounded-[28px] transition-all hover:bg-white hover:shadow-md group animate-in slide-in-from-left-4 duration-300">
                  <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center font-black text-xs border border-slate-200">
                    {index + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Min</span>
                      <input
                        type="number"
                        value={slab.min}
                        onChange={(e) => updateSlab(index, "min", e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-10 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 font-mono text-sm leading-none h-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Max</span>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        value={slab.max}
                        onChange={(e) => updateSlab(index, "max", e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-10 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 font-mono text-sm leading-none h-10"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rate</span>
                      <MdTrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="number"
                        value={slab.rate}
                        onChange={(e) => updateSlab(index, "rate", e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-black text-indigo-600 text-sm leading-none h-10"
                        required
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSlab(index)}
                    className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all disabled:opacity-30"
                    disabled={slabs.length === 1}
                  >
                    <MdRemoveCircleOutline size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-10 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-3xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} />
                  <span>Deploy Tax Policy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
