import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getSalaryTemplate,
  updateSalaryTemplate,
} from "../services/salaryTemplateApi";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave, FiSettings, FiDollarSign, FiPercent } from "react-icons/fi";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const inputClasses = "w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide";

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <FiSettings size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Salary Template</h2>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                Configuration for <span className="text-indigo-600 font-semibold">{form.name}</span>
              </p>
            </div>
          </div>
          <Link
            to="/salary-template"
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-medium"
          >
            <FiArrowLeft /> Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-8">
              <label className={labelClasses}>Template Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`${inputClasses} text-lg font-semibold`}
                required
                placeholder="e.g. Standard Executive Template"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiDollarSign className="text-emerald-500" /> Earnings Distribution (%)
                </h3>
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

              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiPercent className="text-orange-500" /> Statutory Deductions (%)
                </h3>
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

                <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
                  <p className="text-xs text-slate-500">
                    Template changes will apply to all future assignments. Existing assignments remain unchanged until manually updated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all active:scale-95 group"
            >
              <FiSave className="text-indigo-400 group-hover:scale-110 transition-transform" />
              Save Template Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SalaryTemplateEdit;
