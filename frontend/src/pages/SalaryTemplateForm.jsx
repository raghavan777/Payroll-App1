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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Framework Architect</h1>
          <p className="text-slate-500 font-medium mt-1">Design modular compensation structures with precise logic.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl border border-indigo-100 italic text-xs font-bold">
          <MdCalculate size={16} />
          <span>Dynamic Computation Engine</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-12">
        <div className="space-y-12">
          {/* Base Configuration */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Blueprint Identity</label>
            <div className="relative group max-w-md">
              <MdTextFields size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-black text-slate-700"
                placeholder="e.g. Senior Engineering Tier A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EARNINGS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Earnings</h3>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <MdTrendingUp /> Multipliers & Add-ons
                  </p>
                </div>
                <button
                  onClick={() => addRow("earnings")}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all active:scale-90 shadow-sm"
                >
                  <MdAdd size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {form.earnings.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                    <p className="text-slate-400 text-sm font-bold">No earning components assigned.</p>
                  </div>
                ) : form.earnings.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl group animate-in slide-in-from-left-2">
                    <input
                      placeholder="e.g. Base Pay"
                      className="bg-white border border-slate-200 p-3 rounded-xl flex-1 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                      value={e.name}
                      onChange={(ev) => updateRow("earnings", i, "name", ev.target.value)}
                    />
                    <select
                      className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-black text-slate-500 outline-none appearance-none"
                      value={e.calculationType}
                      onChange={(ev) => updateRow("earnings", i, "calculationType", ev.target.value)}
                    >
                      <option value="FIXED">FIXED</option>
                      <option value="PERCENTAGE">% OF BASE</option>
                    </select>
                    <div className="relative w-24">
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-black text-emerald-600 outline-none pr-6"
                        value={e.value}
                        onChange={(ev) => updateRow("earnings", i, "value", ev.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">
                        {e.calculationType === 'PERCENTAGE' ? '%' : '$'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeRow("earnings", i)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Deductions</h3>
                  <p className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                    <MdTrendingDown /> Liabilities & Retentions
                  </p>
                </div>
                <button
                  onClick={() => addRow("deductions")}
                  className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all active:scale-90 shadow-sm"
                >
                  <MdAdd size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {form.deductions.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                    <p className="text-slate-400 text-sm font-bold">No deduction components assigned.</p>
                  </div>
                ) : form.deductions.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl group animate-in slide-in-from-right-2">
                    <input
                      placeholder="e.g. Health Tax"
                      className="bg-white border border-slate-200 p-3 rounded-xl flex-1 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 transition-all"
                      value={d.name}
                      onChange={(ev) => updateRow("deductions", i, "name", ev.target.value)}
                    />
                    <select
                      className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-black text-slate-500 outline-none appearance-none"
                      value={d.calculationType}
                      onChange={(ev) => updateRow("deductions", i, "calculationType", ev.target.value)}
                    >
                      <option value="FIXED">FIXED</option>
                      <option value="PERCENTAGE">% OF BASE</option>
                    </select>
                    <div className="relative w-24">
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-black text-rose-600 outline-none pr-6"
                        value={d.value}
                        onChange={(ev) => updateRow("deductions", i, "value", ev.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">
                        {d.calculationType === 'PERCENTAGE' ? '%' : '$'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeRow("deductions", i)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex justify-end">
            <button
              onClick={saveTemplate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-3xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} />
                  <span>Deploy Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
