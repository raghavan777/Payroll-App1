import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPayrollProfile, updatePayrollProfile } from "../services/payrollApi";
import { motion } from "framer-motion";
import {
  FiArrowLeft, FiSave, FiCreditCard, FiDollarSign,
  FiActivity, FiBriefcase, FiShield
} from "react-icons/fi";
import { toast } from "react-hot-toast";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const inputClasses = "w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide";

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Payroll Profile</h2>
            <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-bold">
              Employee Code: <span className="text-indigo-600 font-mono">{employeeCode}</span>
            </p>
          </div>
          <Link
            to={`/payroll-profile/${employeeCode}`}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <FiArrowLeft /> Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Salary Components Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiDollarSign size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Salary Components</h3>
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
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FiCreditCard size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bank Details</h3>
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
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <FiShield size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Tax Settings</h3>
                </div>

                <div>
                  <label className={labelClasses}>Tax Regime</label>
                  <select
                    name="taxRegime"
                    value={form.taxRegime}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="Old">Old Regime (Standard)</option>
                    <option value="New">New Regime (Default)</option>
                  </select>
                </div>
              </div>

              <div className="mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
                <p className="text-sm text-slate-500 italic">
                  Note: Updating these values will affect the next payroll run for this employee. Please verify account details before saving.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <FiSave /> Update Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PayrollProfileEdit;
