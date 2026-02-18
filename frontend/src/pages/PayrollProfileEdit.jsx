import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPayrollProfile, updatePayrollProfile } from "../services/payrollApi";
import { motion } from "framer-motion";
import {
  MdArrowBack, MdSave, MdCreditCard, MdAttachMoney,
  MdTrendingUp, MdWork, MdShield, MdFingerprint
} from "react-icons/md";
import { toast } from "react-hot-toast";
import Dropdown from "../components/Dropdown";

const PayrollProfileEdit = () => {
  const { employeeCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    basic: "",
    hra: "",
    allowances: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    taxRegime: "Old",
  });

  useEffect(() => {
    getPayrollProfile(employeeCode).then((res) => {
      const p = res.data;
      setForm({
        basic: p.salaryStructure?.basic || "",
        hra: p.salaryStructure?.hra || "",
        allowances: p.salaryStructure?.allowances || "",
        bankName: p.bankDetails?.bankName || "",
        accountNumber: p.bankDetails?.accountNumber || "",
        ifsc: p.bankDetails?.ifsc || "",
        taxRegime: p.taxRegime || "Old",
      });
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load profile");
      navigate("/payroll-profiles");
    });
  }, [employeeCode, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePayrollProfile(employeeCode, {
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
      toast.success("Profile Updated Successfully!");
      navigate(`/payroll-profile/${employeeCode}`);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClasses = "w-full border border-white/10 bg-white/5 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-white font-bold placeholder:text-slate-500";
  const labelClasses = "block text-[10px] font-black text-indigo-300 mb-3 uppercase tracking-[0.2em] ml-1";

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Modify Framework</h2>
            <p className="text-slate-400 mt-2 uppercase tracking-widest text-[10px] font-black flex items-center gap-2">
              <MdFingerprint className="text-indigo-400" size={14} />
              Protocol Signature: <span className="text-indigo-300 font-mono text-xs">{employeeCode}</span>
            </p>
          </div>
          <Link
            to={`/payroll-profile/${employeeCode}`}
            className="flex items-center gap-2 text-white hover:text-indigo-300 transition-all bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 active:scale-95 shadow-xl font-bold uppercase tracking-widest text-[10px]"
          >
            <MdArrowBack size={18} /> Revert Changes
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Salary Components Section */}
          <div className="premium-card p-8 rounded-[32px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-500/10 text-indigo-300 rounded-xl border border-indigo-500/20">
                <MdAttachMoney size={24} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Salary Core Architecture</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClasses}>Basic Salary</label>
                <input
                  name="basic"
                  type="number"
                  value={form.basic}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelClasses}>HRA</label>
                <input
                  name="hra"
                  type="number"
                  value={form.hra}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelClasses}>Allowances</label>
                <input
                  name="allowances"
                  type="number"
                  value={form.allowances}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Details Section */}
            <div className="premium-card p-8 rounded-[32px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 text-blue-300 rounded-xl border border-blue-500/20">
                  <MdCreditCard size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Remittance Protocol</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>Bank Name</label>
                  <input
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Account Number</label>
                  <input
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className={labelClasses}>IFSC Code</label>
                  <input
                    name="ifsc"
                    value={form.ifsc}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="ENTER IFSC"
                  />
                </div>
              </div>
            </div>

            {/* Compliance & Tax Section */}
            <div className="premium-card p-8 rounded-[32px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/20">
                    <MdShield size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">Statutory Logic</h3>
                </div>

                <div>
                  <label className={labelClasses}>Tax Regime</label>
                  <Dropdown
                    options={[
                      { value: "Old", label: "Old Regime (Standard Legacy)" },
                      { value: "New", label: "New Regime (Accelerated Protocol)" }
                    ]}
                    value={form.taxRegime}
                    onChange={(e) => handleChange({ target: { name: "taxRegime", value: e.target.value } })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-12 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 border-dashed">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Notice: Modification of these parameters will recalibrate the subsequent payroll cycle for this entity. Verify account integrity prior to authentication.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <button
              type="submit"
              className="group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all overflow-hidden uppercase tracking-[0.2em] text-xs"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <MdSave size={20} /> Commit Updates
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PayrollProfileEdit;
