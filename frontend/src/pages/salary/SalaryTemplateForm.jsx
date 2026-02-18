import { useState, useEffect } from "react";
import { createSalaryTemplate, updateSalaryTemplate, getSalaryTemplate } from "../../services/salaryTemplateApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdLabel,
  MdPercent,
  MdPayments,
  MdAccountBalanceWallet,
  MdLayers,
  MdAnalytics
} from "react-icons/md";

export default function SalaryTemplateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    earnings: {
      basicPercent: 50,
      hraPercent: 40,
      allowancePercent: 10
    },
    deductions: {
      pfPercent: 12,
      esiPercent: 0.75,
      taxPercent: 10
    }
  });

  useEffect(() => {
    if (id) loadExisting();
  }, [id]);

  const loadExisting = async () => {
    try {
      setLoading(true);
      const res = await getSalaryTemplate(id);
      const t = res.data;
      // Map flat backend structure to nested frontend state
      setForm({
        name: t.name,
        earnings: {
          basicPercent: t.basicPercent,
          hraPercent: t.hraPercent,
          allowancePercent: t.allowancePercent
        },
        deductions: {
          pfPercent: t.pfPercent,
          esiPercent: t.esiPercent,
          taxPercent: t.taxPercent
        }
      });
    } catch (error) {
      toast.error("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (path, value) => {
    const parts = path.split(".");
    if (parts.length === 1) {
      setForm({ ...form, [path]: value });
    } else {
      setForm({
        ...form,
        [parts[0]]: {
          ...form[parts[0]],
          [parts[1]]: value
        }
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        basicPercent: Number(form.earnings.basicPercent),
        hraPercent: Number(form.earnings.hraPercent),
        allowancePercent: Number(form.earnings.allowancePercent),
        pfPercent: Number(form.deductions.pfPercent),
        esiPercent: Number(form.deductions.esiPercent),
        taxPercent: Number(form.deductions.taxPercent)
      };

      if (id) {
        await updateSalaryTemplate(id, payload);
        toast.success("Framework updated successfully!");
      } else {
        await createSalaryTemplate(payload);
        toast.success("Framework created successfully!");
      }

      navigate("/salary-template");
    } catch (error) {
      toast.error("Failed to save framework");
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (id && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm animate-pulse">Syncing Framework Schema...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/salary-template")}
            className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
              {id ? "Optimize Logic" : "New Framework"}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              {id ? "Refining institutional compensation vectors" : "Defining core organizational salary blueprints"}
            </p>
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black px-8 py-4 rounded-[24px] shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 transition-all text-sm group"
        >
          <MdSave size={20} className="group-hover:rotate-12 transition-transform" />
          <span>{id ? "Commit Updates" : "Initialize Framework"}</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        {/* --- CORE IDENTIFIER --- */}
        <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-14 h-14 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <MdLabel size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity & Label</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Naming the Compensation Logic</p>
            </div>
          </div>

          <div className="relative group/input max-w-2xl">
            <input
              required
              className="w-full bg-white/80 border border-slate-200 p-6 rounded-[28px] text-xl font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="Blueprint Name (e.g., Executive Tier 1)"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
              <MdLayers size={24} />
            </div>
          </div>
        </motion.div>

        {/* --- GRID SECTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Section: Earnings (Asset Side) */}
          <motion.div variants={itemVariants} className="bg-emerald-50/30 backdrop-blur-xl border border-emerald-100/50 p-10 rounded-[48px] shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                <MdPayments size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Earnings Vectors</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Asset Allocation Percentages</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Basic Pay", key: "basicPercent", icon: <MdAccountBalanceWallet /> },
                { label: "House Rent (HRA)", key: "hraPercent", icon: <MdPayments /> },
                { label: "Allowances", key: "allowancePercent", icon: <MdAnalytics /> }
              ].map((field) => (
                <div key={field.key} className="relative group/field transition-all">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 block">{field.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-white p-5 pl-14 rounded-[24px] border border-slate-100 font-black text-slate-800 text-lg hover:border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={form.earnings[field.key]}
                      onChange={(e) => handleChange(`earnings.${field.key}`, e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-emerald-500 transition-colors">
                      {field.icon}
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300">
                      <span className="text-xs font-black uppercase text-slate-400 group-focus-within/field:text-emerald-600">Share</span>
                      <MdPercent size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section: Deductions (Liability Side) */}
          <motion.div variants={itemVariants} className="bg-rose-50/30 backdrop-blur-xl border border-rose-100/50 p-10 rounded-[48px] shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-14 h-14 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center">
                <MdAnalytics size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Deduction Metrics</h3>
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Statutory & Tax Vectoring</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Provident Fund (PF)", key: "pfPercent", icon: <MdAccountBalanceWallet /> },
                { label: "Employee Insurance (ESI)", key: "esiPercent", icon: <MdAnalytics /> },
                { label: "Standard Tax Bracket", key: "taxPercent", icon: <MdPercent /> }
              ].map((field) => (
                <div key={field.key} className="relative group/field transition-all">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 block">{field.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-white p-5 pl-14 rounded-[24px] border border-slate-100 font-black text-slate-800 text-lg hover:border-rose-200 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                      value={form.deductions[field.key]}
                      onChange={(e) => handleChange(`deductions.${field.key}`, e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-rose-500 transition-colors">
                      {field.icon}
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300">
                      <span className="text-xs font-black uppercase text-slate-400 group-focus-within/field:text-rose-600">Rate</span>
                      <MdPercent size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- VALIDATION PULSE --- */}
        <motion.div variants={itemVariants} className="flex items-center justify-center p-8 bg-indigo-900/5 rounded-[32px] border border-indigo-900/5 text-slate-500 gap-4 text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
          Ensuring system-wide compliance with statutory thresholds
        </motion.div>
      </form>
    </motion.div>
  );
}
