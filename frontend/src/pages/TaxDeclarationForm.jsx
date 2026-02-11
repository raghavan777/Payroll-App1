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
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Annual Tax Declaration</h1>
        <p className="text-slate-500 font-medium mt-1">Declare your expected earnings and investments for the financial year.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-12">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee ID / Code */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Team Member Code</label>
              <div className="relative group">
                <MdPerson size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 uppercase tracking-widest"
                  placeholder="e.g. EMP001"
                  value={form.employeeId}
                  onChange={(e) => onChange("employeeId", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Financial Year */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fiscal Period</label>
              <div className="relative group">
                <MdCalendarToday size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 font-mono"
                  placeholder="2025-2026"
                  value={form.financialYear}
                  onChange={(e) => onChange("financialYear", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Regime */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Tax Regime</label>
              <div className="relative group">
                <MdLayers size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <select
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 appearance-none"
                  value={form.selectedRegime}
                  onChange={(e) => onChange("selectedRegime", e.target.value)}
                >
                  <option value="old">Standard (Old Regime)</option>
                  <option value="new">Simplified (New Regime)</option>
                </select>
              </div>
            </div>

            {/* Total Income */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Projected Annual Income</label>
              <div className="relative group">
                <MdAttachMoney size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 text-lg"
                  placeholder="0.00"
                  value={form.totalIncome}
                  onChange={(e) => onChange("totalIncome", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Investments */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deductible Investments (80C, etc.)</label>
              <div className="relative group">
                <MdShield size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-black text-slate-700 text-lg"
                  placeholder="Total amount eligible for deduction"
                  value={form.investments}
                  onChange={(e) => onChange("investments", e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Supporting Documentation (Proofs)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                  <MdFileUpload size={24} />
                </div>
                <input
                  type="file"
                  multiple
                  className="w-full bg-slate-50 border border-dashed border-slate-200 pl-14 pr-4 py-8 rounded-3xl outline-none hover:bg-slate-100/50 hover:border-slate-300 transition-all font-bold text-slate-500 cursor-pointer"
                  onChange={(e) => setProofFiles(Array.from(e.target.files || []))}
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-4">Accepts multiple PDF or Image files</p>
              </div>
            </div>
          </div>

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
                  <span>File Declaration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
