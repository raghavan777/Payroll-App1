import { useState } from "react";
import { createPayrollProfile } from "../services/payrollApi";
import { useNavigate } from "react-router-dom";
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

const PayrollProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employeeCode: "",
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
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Structuring</h1>
        <p className="text-slate-500 font-medium mt-1">Configure compensation matrices and statutory disbursement protocols.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Primary Configuration */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <MdPerson size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-none mb-1">Entity Reference</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Identity</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee Code</label>
                  <div className="relative">
                    <MdLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="employeeCode"
                      value={form.employeeCode}
                      onChange={handleChange}
                      placeholder="EMP-2026-XXXX"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Regulatory Regime</label>
                  <div className="relative">
                    <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                      name="taxRegime"
                      value={form.taxRegime}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                    >
                      <option value="Old">Old System (Statutory Slabs)</option>
                      <option value="New">New System (Optimized)</option>
                    </select>
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
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <MdPayments size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-none mb-1">Compensation Matrix</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earnings Attribution</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Basic Comp</label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="basic"
                      type="number"
                      value={form.basic}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-black text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Housing Allocation (HRA)</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flexible Allowances</label>
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
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <MdAccountBalance size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-none mb-1">Disbursement Directives</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banking Protocol</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Bank Name</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Identifier</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statutory IFSC Protocol</label>
                  <div className="relative">
                    <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      name="ifsc"
                      value={form.ifsc}
                      onChange={handleChange}
                      placeholder="NRB0000123"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono font-black text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white hover:bg-slate-50 text-slate-600 font-bold px-8 py-5 rounded-[24px] border border-slate-200 transition-all active:scale-95"
              >
                Institutional Recall
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-slate-800 text-white font-black px-12 py-5 rounded-[24px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <MdSave size={24} className="group-hover:translate-y-px" />
                    <span>Synchronize Profile</span>
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
