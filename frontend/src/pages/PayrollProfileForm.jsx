import { useState, useEffect } from "react";
import { createPayrollProfile } from "../services/payrollApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  MdPerson,
  MdPayments,
  MdAccountBalance,
  MdShield,
  MdSave,
  MdLayers,
  MdAttachMoney,
  MdCreditCard,
  MdSettingsSuggest
} from "react-icons/md";
import Dropdown from "../components/Dropdown";

const PayrollProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employeeCode: location.state?.employeeCode || "",
    basic: "",
    hra: "",
    allowances: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    taxRegime: "Old",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPayrollProfile({
        employeeCode: form.employeeCode,
        salaryStructure: {
          basic: Number(form.basic),
          hra: Number(form.hra),
          allowances: Number(form.allowances),
        },
        bankDetails: {
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
        },
        taxRegime: form.taxRegime,
      });

      toast.success("Institutional profile synchronized");
      navigate("/payroll-profiles");
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Financial Structuring</h1>
        <p className="text-slate-300 font-medium mt-1">Configure compensation matrices and statutory disbursement protocols.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Primary Configuration */}
          <div className="lg:col-span-1 space-y-8">
            <div className="premium-card rounded-[40px] p-8 space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-300 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
                  <MdPerson size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">Entity Reference</h3>
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Primary Identity</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Employee Code</label>
                  <div className="relative group">
                    <MdLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={20} />
                    <input
                      name="employeeCode"
                      value={form.employeeCode}
                      onChange={handleChange}
                      placeholder="EMP-2026-XXXX"
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-white placeholder:text-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Regulatory Regime</label>
                  <div className="relative group">
                    <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={20} />
                    <Dropdown
                      options={[
                        { value: "Old", label: "Old System (Statutory Slabs)" },
                        { value: "New", label: "New System (Optimized Protocol)" }
                      ]}
                      value={form.taxRegime}
                      onChange={(e) => handleChange({ target: { name: "taxRegime", value: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <MdSettingsSuggest className="text-indigo-400 mb-4" size={32} />
              <h4 className="text-xl font-black mb-1">Financial Integrity</h4>
              <p className="text-indigo-200 text-xs font-medium leading-relaxed">Ensure all compensation pillars are validated against institutional payroll policies before synchronization.</p>
            </div>
          </div>

          {/* Detailed Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Compensation Details */}
            <div className="premium-card rounded-[40px] p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-xl">
                  <MdPayments size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">Compensation Matrix</h3>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Earnings Attribution</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Monthly Basic Comp</label>
                  <div className="relative group">
                    <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" size={20} />
                    <input
                      name="basic"
                      type="number"
                      value={form.basic}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-black text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Housing Allocation (HRA)</label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="hra"
                      type="number"
                      value={form.hra}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-black text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Flexible Allowances</label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="allowances"
                      type="number"
                      value={form.allowances}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-black text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="premium-card rounded-[40px] p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-8">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-xl">
                  <MdAccountBalance size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">Disbursement Directives</h3>
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Banking Protocol</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Institutional Bank Name</label>
                  <div className="relative">
                    <MdAccountBalance className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
                      placeholder="National Reserve Bank"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Account Identifier</label>
                  <div className="relative">
                    <MdCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono font-black text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Statutory IFSC Protocol</label>
                  <div className="relative group">
                    <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400" size={20} />
                    <input
                      name="ifsc"
                      value={form.ifsc}
                      onChange={handleChange}
                      placeholder="NRB0000123"
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono font-black text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-white hover:text-indigo-300 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Institutional Recall
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-[24px] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 overflow-hidden uppercase tracking-widest text-xs"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <MdSave size={24} />
                    <span>Synchronize Protocol</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PayrollProfileForm;
