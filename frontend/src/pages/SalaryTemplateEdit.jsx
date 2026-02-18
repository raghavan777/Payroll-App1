import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getSalaryTemplate,
  updateSalaryTemplate,
} from "../services/salaryTemplateApi";
import { motion } from "framer-motion";
import { MdArrowBack, MdSave, MdSettings, MdAttachMoney, MdPercent, MdShield } from "react-icons/md";
import { toast } from "react-hot-toast";

const SalaryTemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    basicPercent: "",
    hraPercent: "",
    allowancePercent: "",
    pfPercent: "",
    esiPercent: "",
    taxPercent: "",
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await getSalaryTemplate(id);
        const t = res.data;
        setForm({
          name: t.name || "",
          basicPercent: t.basicPercent || "",
          hraPercent: t.hraPercent || "",
          allowancePercent: t.allowancePercent || "",
          pfPercent: t.pfPercent || "",
          esiPercent: t.esiPercent || "",
          taxPercent: t.taxPercent || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load salary template");
        navigate("/salary-template");
      }
    };
    if (id) fetchTemplate();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSalaryTemplate(id, {
        name: form.name,
        basicPercent: Number(form.basicPercent),
        hraPercent: Number(form.hraPercent),
        allowancePercent: Number(form.allowancePercent),
        pfPercent: Number(form.pfPercent),
        esiPercent: Number(form.esiPercent),
        taxPercent: Number(form.taxPercent),
      });
      toast.success("Salary Template Updated Successfully");
      navigate("/salary-template");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing protocol data...</p>
      </div>
    );
  }

  const inputClasses = "w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-black text-white text-sm tracking-tight shadow-inner";
  const labelClasses = "block text-[10px] font-black text-indigo-300 mb-3 uppercase tracking-[0.2em] ml-1";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-[20px] shadow-[0_15px_40px_rgba(79,70,229,0.4)] flex items-center justify-center text-white border border-white/20">
              <MdSettings size={32} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-2">Recalibrate Architecture</h2>
              <p className="text-slate-400 font-medium italic text-sm tracking-wide">
                Modifying institutional system: <span className="text-indigo-300 font-black uppercase tracking-widest">{form.name}</span>
              </p>
            </div>
          </div>
          <Link
            to="/salary-template"
            className="group relative inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black px-6 py-4 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-xl text-[10px] uppercase tracking-[0.2em]"
          >
            <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Archive</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="mb-12 relative z-10 max-w-lg">
              <label className={labelClasses}>Blueprint Identity Protocol</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`${inputClasses} text-lg font-black uppercase tracking-tight`}
                required
                placeholder="e.g. Standard Executive Template"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8">
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                  <MdAttachMoney className="text-indigo-400 text-lg" /> Accrual Distribution (%)
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={labelClasses}>Basic (%)</label>
                    <input name="basicPercent" type="number" value={form.basicPercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                  <div>
                    <label className={labelClasses}>HRA (%)</label>
                    <input name="hraPercent" type="number" value={form.hraPercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                  <div>
                    <label className={labelClasses}>Allowances (%)</label>
                    <input name="allowancePercent" type="number" value={form.allowancePercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-3 bg-rose-500/5 w-fit px-4 py-2 rounded-xl border border-rose-500/10">
                  <MdPercent className="text-rose-500 text-lg" /> Outflow Protocols (%)
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={labelClasses}>PF (%)</label>
                    <input name="pfPercent" type="number" value={form.pfPercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                  <div>
                    <label className={labelClasses}>ESI (%)</label>
                    <input name="esiPercent" type="number" value={form.esiPercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                  <div>
                    <label className={labelClasses}>Income Tax (%)</label>
                    <input name="taxPercent" type="number" value={form.taxPercent} onChange={handleChange} className={inputClasses} step="0.01" />
                  </div>
                </div>

                <div className="mt-8 bg-white/5 p-8 rounded-[32px] border border-white/10 border-dashed flex items-start gap-4 shadow-inner">
                  <MdShield className="text-indigo-400 mt-0.5 shrink-0" size={20} />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed opacity-80">
                    Template permutations will apply to all future system assignments. Existing instances remain locked until manual recalibration is initiated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="group relative inline-flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-12 rounded-[28px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all active:scale-95 uppercase tracking-[0.3em] text-xs overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <MdSave size={24} className="relative z-10 text-white group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Deploy Institutional Recalibration</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SalaryTemplateEdit;
