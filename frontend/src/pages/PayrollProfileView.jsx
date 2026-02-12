import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getPayrollProfile } from "../services/payrollApi";
import { motion } from "framer-motion";
import {
  FiUser, FiCreditCard, FiActivity, FiArrowLeft,
  FiEdit, FiEye, FiCalendar, FiDollarSign, FiHash, FiShield
} from "react-icons/fi";

const PayrollProfileView = () => {
  const { employeeCode } = useParams();
  const [profile, setProfile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const res = await getPayrollProfile(employeeCode);
      setProfile(res.data);
    } catch {
      toast.error("Failed to fetch payroll profile");
    }
  };

  useEffect(() => {
    if (!employeeCode) return;
    loadProfile();
  }, [employeeCode]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/salary-template", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTemplates(res.data))
      .catch(() => toast.error("Failed to load salary templates"));
  }, [token]);

  const handleTemplateAssign = async () => {
    if (!selectedTemplate) {
      return toast.error("Please select a salary template");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/payroll-profile/${employeeCode}/assign-template`,
        { templateId: selectedTemplate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Salary template assigned successfully");
      setSelectedTemplate("");
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign template");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const salary = profile.salaryStructure;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Payroll Profile
            </h2>
            <div className="text-slate-500 mt-1 flex items-center gap-2">
              <FiUser className="text-indigo-600" />
              {profile.employeeName || "Unknown Employee"} —
              <span className="font-mono text-indigo-600 font-semibold">{profile.employeeCode}</span>
            </div>
          </div>
          <Link
            to="/payroll-profiles"
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <FiArrowLeft /> Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats Cards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Basic Salary', val: salary?.basic, icon: FiDollarSign, color: 'indigo' },
                { label: 'HRA', val: salary?.hra, icon: FiActivity, color: 'blue' },
                { label: 'Allowances', val: salary?.allowances, icon: FiActivity, color: 'emerald' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`p-3 rounded-xl bg-slate-50 text-indigo-600`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {stat.val != null ? `₹${stat.val.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bank Details Card */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FiCreditCard size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bank Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Bank Name</p>
                  <p className="text-lg font-semibold text-slate-800">{profile.bankDetails?.bankName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Account Number</p>
                  <p className="text-lg font-mono text-slate-800">{profile.bankDetails?.accountNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">IFSC Code</p>
                  <p className="text-lg font-mono text-slate-800 uppercase">{profile.bankDetails?.ifsc || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tax Regime</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${profile.taxRegime === 'New' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                    {profile.taxRegime || "—"} Regime
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-8">
            {/* Assign Template Card */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FiShield className="text-indigo-600" /> Quick Assignment
              </h3>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-600">Select Salary Template</label>
                <select
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">-- Choose Template --</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>

                <button
                  onClick={handleTemplateAssign}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                  disabled={!selectedTemplate}
                >
                  Assign Template
                </button>
              </div>
            </motion.div>

            {/* Navigation Actions */}
            <motion.div variants={itemVariants} className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white">
              <h3 className="text-xl font-bold mb-6">Operations</h3>
              <div className="space-y-3">
                <Link to={`/payroll-profile/edit/${employeeCode}`} className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-all group font-medium">
                  <span className="flex items-center gap-3"><FiEdit className="text-slate-400 group-hover:text-indigo-400" /> Edit Profile</span>
                  <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link to={`/salary-preview/${employeeCode}`} className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-all group font-medium">
                  <span className="flex items-center gap-3"><FiEye className="text-slate-400 group-hover:text-purple-400" /> Preview Salary</span>
                  <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link to={`/attendance/${employeeCode}`} className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-all group font-medium">
                  <span className="flex items-center gap-3"><FiCalendar className="text-slate-400 group-hover:text-amber-400" /> Attendance</span>
                  <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PayrollProfileView;
