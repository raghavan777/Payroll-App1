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

import Dropdown from "../components/Dropdown";

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-3 leading-none uppercase">Governance Center</h1>
          <p className="text-slate-400 font-medium italic text-sm tracking-wide">Configure progressive institutional tax slabs and statutory regimes.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-2xl backdrop-blur-md">
          <MdShield size={20} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Regulatory Shield Active</span>
        </div>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Regime & Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-white/10 relative z-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Statutory Regime Selection</label>
              <div className="relative group">
                <Dropdown
                  options={[
                    { value: "old", label: "Unified Protocol (Old Regime)" },
                    { value: "new", label: "Modernized Protocol (New Regime)" }
                  ]}
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  icon={MdLayers}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Fiscal Cycle Architecture</label>
              <div className="relative group">
                <MdCalendarToday size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. 2025-2026"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white font-mono tracking-widest text-xs shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Slab Rows */}
          <div className="space-y-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-1">Progressive Architectures</h3>
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Institutional Bracket Recalibration</p>
              </div>
              <button
                type="button"
                onClick={addSlab}
                className="group relative inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black px-6 py-4 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-xl text-[10px] uppercase tracking-[0.2em]"
              >
                <MdAdd size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span>Insert Increment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {slabs.map((slab, index) => (
                <div key={index} className="flex flex-col lg:flex-row items-center gap-6 bg-white/5 border border-white/10 p-8 rounded-[32px] transition-all hover:bg-white/10 group animate-in slide-in-from-left-4 duration-500 shadow-inner">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1.5 text-[8px] font-black text-indigo-300/40 uppercase tracking-[0.2em] group-focus-within/input:text-indigo-400 transition-colors">Minimum Protocol</span>
                      <input
                        type="number"
                        value={slab.min}
                        onChange={(e) => updateSlab(index, "min", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 pl-4 pr-3 pt-6 pb-2 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 outline-none transition-all font-black text-white font-mono text-sm shadow-inner"
                        required
                      />
                    </div>

                    <div className="relative group/input">
                      <span className="absolute left-4 top-1.5 text-[8px] font-black text-indigo-300/40 uppercase tracking-[0.2em] group-focus-within/input:text-indigo-400 transition-colors">Maximum Protocol</span>
                      <input
                        type="number"
                        placeholder="UNLIMITED"
                        value={slab.max}
                        onChange={(e) => updateSlab(index, "max", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 pl-4 pr-3 pt-6 pb-2 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 outline-none transition-all font-black text-white font-mono text-sm shadow-inner placeholder:text-slate-800"
                      />
                    </div>

                    <div className="relative group/input">
                      <span className="absolute left-4 top-1.5 text-[8px] font-black text-emerald-400/40 uppercase tracking-[0.2em] group-focus-within/input:text-emerald-400 transition-colors">Outflow Rate %</span>
                      <MdTrendingUp size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-emerald-500 group-focus-within/input:scale-110 transition-all" />
                      <input
                        type="number"
                        value={slab.rate}
                        onChange={(e) => updateSlab(index, "rate", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 pl-4 pr-12 pt-6 pb-2 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all font-black text-emerald-400 font-mono text-base shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSlab(index)}
                    className="p-3 text-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all disabled:opacity-0 active:scale-90"
                    disabled={slabs.length === 1}
                  >
                    <MdRemoveCircleOutline size={26} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex justify-end relative z-10">
            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-xs overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} className="relative z-10 text-white group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Commit Statutory Deployment</span>
                </>
              )}
            </button>
          </div>
        </form >
      </div >
    </div >
  );
}
