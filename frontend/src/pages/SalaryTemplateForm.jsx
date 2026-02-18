import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdRemoveCircleOutline,
  MdSave,
  MdTextFields,
  MdTrendingUp,
  MdTrendingDown,
  MdLayers,
  MdCalculate,
  MdAttachMoney,
  MdShield
} from "react-icons/md";
import Dropdown from "../components/Dropdown";

export default function SalaryTemplateForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    earnings: [],
    deductions: []
  });

  const addRow = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { name: "", calculationType: "FIXED", value: 0 }]
    });
  };

  const removeRow = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  const updateRow = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const saveTemplate = async () => {
    if (!form.name) return toast.error("Blueprint name is required");

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/salary-template/template",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Compensation framework deployed!");
      navigate("/salary-template");
    } catch (err) {
      toast.error("Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">Framework Architect</h1>
          <p className="text-slate-400 font-medium italic text-sm tracking-wide">Institutional Compensation Engineering Logic Hub</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl text-indigo-300 font-black text-[10px] uppercase tracking-[0.2em]">
          <MdCalculate size={22} className="animate-pulse" />
          <span>Dynamic Computation Core</span>
        </div>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="space-y-12">
          {/* Base Configuration */}
          <div className="space-y-6 relative z-10">
            <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] ml-1">Blueprint Identity Protocol</label>
            <div className="relative group max-w-lg">
              <MdTextFields size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all" />
              <input
                className="w-full bg-white/5 border border-white/10 pl-16 pr-8 py-6 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-black text-white text-base tracking-tight shadow-inner uppercase"
                placeholder="e.g. Senior Strategic Execution Tier"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EARNINGS */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Accrual Vectors</h3>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                    <MdTrendingUp className="text-lg" /> Multipliers & Add-ons
                  </p>
                </div>
                <button
                  onClick={() => addRow("earnings")}
                  className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-90 shadow-xl"
                >
                  <MdAdd size={28} />
                </button>
              </div>

              <div className="space-y-4">
                {form.earnings.length === 0 ? (
                  <div className="p-12 border-2 border-dashed border-white/5 rounded-[32px] text-center bg-white/5 backdrop-blur-md">
                    <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">No earning components defined</p>
                  </div>
                ) : form.earnings.map((e, i) => (
                  <div key={i} className="flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[28px] group/row transition-all hover:bg-white/10 relative shadow-2xl">
                    <div className="flex items-center gap-4">
                      <input
                        placeholder="Earning Target Name"
                        className="bg-white/5 border border-white/10 p-4 rounded-xl flex-1 text-sm font-black text-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-inner uppercase tracking-widest placeholder:text-slate-700"
                        value={e.name}
                        onChange={(ev) => updateRow("earnings", i, "name", ev.target.value)}
                      />
                      <button
                        onClick={() => removeRow("earnings", i)}
                        className="p-3 text-slate-600 hover:text-rose-400 transition-all hover:scale-110 active:scale-90"
                      >
                        <MdRemoveCircleOutline size={24} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Dropdown
                          options={[
                            { value: "FIXED", label: "FIXED VALUE (INR)" },
                            { value: "PERCENTAGE", label: "% OF BASIC COMP" }
                          ]}
                          value={e.calculationType}
                          onChange={(ev) => updateRow("earnings", i, "calculationType", ev.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="relative w-36">
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm font-black text-emerald-400 outline-none pr-10 shadow-inner tabular-nums"
                          value={e.value}
                          onChange={(ev) => updateRow("earnings", i, "value", ev.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">
                          {e.calculationType === 'PERCENTAGE' ? '%' : '₹'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Statutory Outflow</h3>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                    <MdTrendingDown className="text-lg" /> Liabilities & Retentions
                  </p>
                </div>
                <button
                  onClick={() => addRow("deductions")}
                  className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-90 shadow-xl"
                >
                  <MdAdd size={28} />
                </button>
              </div>

              <div className="space-y-4">
                {form.deductions.length === 0 ? (
                  <div className="p-12 border-2 border-dashed border-white/5 rounded-[32px] text-center bg-white/5 backdrop-blur-md">
                    <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">No deduction components defined</p>
                  </div>
                ) : form.deductions.map((d, i) => (
                  <div key={i} className="flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[28px] group/row transition-all hover:bg-white/10 relative shadow-2xl">
                    <div className="flex items-center gap-4">
                      <input
                        placeholder="Deduction Protocol Name"
                        className="bg-white/5 border border-white/10 p-4 rounded-xl flex-1 text-sm font-black text-white outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all shadow-inner uppercase tracking-widest placeholder:text-slate-700"
                        value={d.name}
                        onChange={(ev) => updateRow("deductions", i, "name", ev.target.value)}
                      />
                      <button
                        onClick={() => removeRow("deductions", i)}
                        className="p-3 text-slate-600 hover:text-rose-400 transition-all hover:scale-110 active:scale-90"
                      >
                        <MdRemoveCircleOutline size={24} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Dropdown
                          options={[
                            { value: "FIXED", label: "FIXED REMITTANCE (INR)" },
                            { value: "PERCENTAGE", label: "% OF BASIC COMP" }
                          ]}
                          value={d.calculationType}
                          onChange={(ev) => updateRow("deductions", i, "calculationType", ev.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="relative w-36">
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm font-black text-rose-400 outline-none pr-10 shadow-inner tabular-nums"
                          value={d.value}
                          onChange={(ev) => updateRow("deductions", i, "value", ev.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">
                          {d.calculationType === 'PERCENTAGE' ? '%' : '₹'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/40 flex justify-end">
            <button
              onClick={saveTemplate}
              disabled={loading}
              className="group relative inline-flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-xs overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} className="relative z-10 text-white group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Deploy Institutional Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
