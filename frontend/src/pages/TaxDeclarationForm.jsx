import { useState } from "react";
import { toast } from "react-hot-toast";
import { createDeclaration } from "../services/taxService";
import {
  MdDescription,
  MdPerson,
  MdCalendarToday,
  MdLayers,
  MdAttachMoney,
  MdFileUpload,
  MdSave,
  MdShield
} from "react-icons/md";
import Dropdown from "../components/Dropdown";

export default function TaxDeclarationForm() {
  const [form, setForm] = useState({
    employeeId: "",
    financialYear: "",
    selectedRegime: "old",
    totalIncome: "",
    investments: "",
  });
  const [proofFiles, setProofFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createDeclaration({
        ...form,
        totalIncome: Number(form.totalIncome || 0),
        investments: Number(form.investments || 0),
        proofFiles,
      });
      toast.success("Tax declaration submitted for review!");
      setForm({
        employeeId: "",
        financialYear: "",
        selectedRegime: "old",
        totalIncome: "",
        investments: "",
      });
      setProofFiles([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-3 leading-none">Annual Tax Declaration</h1>
        <p className="text-slate-400 font-medium italic text-sm tracking-wide">Declare your expected earnings and institutional investments for the fiscal period.</p>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee ID / Code */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Institutional Protocol Code</label>
              <div className="relative group">
                <MdPerson size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all" />
                <input
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white uppercase tracking-[0.2em] text-xs placeholder:text-slate-700 shadow-inner"
                  placeholder="e.g. EMP001"
                  value={form.employeeId}
                  onChange={(e) => onChange("employeeId", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Financial Year */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Fiscal Cycle</label>
              <div className="relative group">
                <MdCalendarToday size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all" />
                <input
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-5 rounded-[22px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-white font-mono tracking-widest shadow-inner placeholder:text-slate-700"
                  placeholder="2025-2026"
                  value={form.financialYear}
                  onChange={(e) => onChange("financialYear", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Regime */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Statutory Regime Selection</label>
              <div className="relative group">
                <Dropdown
                  options={[
                    { value: "old", label: "Standard Protocol (Old Regime)" },
                    { value: "new", label: "Optimized Protocol (New Regime)" }
                  ]}
                  value={form.selectedRegime}
                  onChange={(e) => onChange("selectedRegime", e.target.value)}
                  icon={MdLayers}
                  className="w-full"
                />
              </div>
            </div>

            {/* Total Income */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] ml-1">Projected Institutional Earnings</label>
              <div className="relative group">
                <MdAttachMoney size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all" />
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-10 py-5 rounded-[22px] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-white text-xl tracking-tighter shadow-inner tabular-nums placeholder:text-slate-700"
                  placeholder="0.00"
                  value={form.totalIncome}
                  onChange={(e) => onChange("totalIncome", e.target.value)}
                  required
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">INR</span>
              </div>
            </div>

            {/* Investments */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em] ml-1">Deductible Assets (Statutory 80C Protocols)</label>
              <div className="relative group">
                <MdShield size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 group-focus-within:rotate-12 transition-all" />
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 pl-16 pr-10 py-6 rounded-[24px] focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all font-black text-white text-xl tracking-tighter shadow-inner tabular-nums placeholder:text-slate-700"
                  placeholder="Cumulative amount eligible for institutional deduction"
                  value={form.investments}
                  onChange={(e) => onChange("investments", e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">INR</span>
              </div>
            </div>

            {/* File Upload */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Statutory Verification Proofs</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 flex items-center group-hover:text-indigo-400 transition-colors">
                  <MdFileUpload size={32} />
                </div>
                <input
                  type="file"
                  multiple
                  className="w-full bg-white/5 border border-dashed border-white/10 pl-20 pr-8 py-10 rounded-[32px] outline-none hover:bg-white/10 hover:border-indigo-500/30 transition-all font-black text-slate-500 cursor-pointer shadow-inner text-xs uppercase tracking-[0.2em]"
                  onChange={(e) => setProofFiles(Array.from(e.target.files || []))}
                />
                <div className="flex items-center gap-4 mt-4 ml-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Institutional protocol requires PDF or high-resolution imagery</p>
                </div>
              </div>
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
                  <span className="relative z-10">Initialize Settlement Lock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
