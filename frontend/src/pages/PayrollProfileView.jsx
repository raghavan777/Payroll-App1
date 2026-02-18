import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getPayrollProfile } from "../services/payrollApi";
import { getEmployee } from "../api/employeeApi";
import { motion } from "framer-motion";
import {
  MdPerson, MdCreditCard, MdTrendingUp, MdArrowBack,
  MdEdit, MdVisibility, MdCalendarToday, MdAttachMoney, MdShield, MdSearch,
  MdLayers
} from "react-icons/md";
import Dropdown from "../components/Dropdown";

const PayrollProfileView = () => {
  const { employeeCode } = useParams();
  const [profile, setProfile] = useState(null);
  const [employeeFallback, setEmployeeFallback] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const res = await getPayrollProfile(employeeCode);
      setProfile(res.data);
      setErrorStatus(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Profile not found, try to fetch employee details for context
        try {
          const empRes = await getEmployee(employeeCode);
          setEmployeeFallback(empRes.data);
          setErrorStatus(404);
        } catch (e) {
          toast.error("Employee not found");
          setErrorStatus(500);
        }
      } else {
        toast.error("Failed to fetch payroll profile");
        setErrorStatus(500);
      }
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

  if (!profile && !errorStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorStatus === 404) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <MdShield size={40} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-black text-white">Profile Not Configured</h2>
          <p className="text-slate-400">
            No payroll profile exists for <span className="text-white font-bold">{employeeFallback?.name || employeeCode}</span>.
            Configure the financial structure to enable payroll operations.
          </p>
          <Link
            to="/payroll-profile/create"
            state={{ employeeCode }}
            className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-600/20 active:scale-95"
          >
            Create Payroll Profile
          </Link>
          <Link to="/payroll-profiles" className="block text-slate-500 text-sm hover:text-white transition-colors">
            Return to List
          </Link>
        </div>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Unable to load profile. Please try again later.</p>
      </div>
    )
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
    <div className="p-4 md:p-8 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Payroll Profile
            </h2>
            <div className="text-slate-300 mt-2 flex items-center gap-2 font-medium">
              <MdPerson className="text-indigo-400" size={20} />
              {profile.employeeName || "Unknown Employee"} —
              <span className="font-mono text-indigo-300 font-bold">{profile.employeeCode}</span>
            </div>
          </div>
          <Link
            to="/payroll-profiles"
            className="flex items-center gap-2 text-white hover:text-indigo-300 transition-all bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 active:scale-95 shadow-xl font-bold uppercase tracking-widest text-[10px]"
          >
            <MdArrowBack size={18} /> Back to List
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats Cards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Basic Salary', val: salary?.basic, icon: MdAttachMoney, color: 'indigo' },
                { label: 'HRA', val: salary?.hra, icon: MdTrendingUp, color: 'blue' },
                { label: 'Allowances', val: salary?.allowances, icon: MdLayers, color: 'emerald' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-start gap-4 hover:bg-white/10 transition-all group"
                >
                  <div className={`p-3 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={26} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-2xl font-black text-white mt-1 tracking-tight">
                      {stat.val != null ? `₹${stat.val.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bank Details Card */}
            <motion.div variants={itemVariants} className="premium-card p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/10 text-indigo-300 rounded-xl border border-indigo-500/20">
                  <MdCreditCard size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Institutional Remittance</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Remittance Partner</p>
                  <p className="text-lg font-bold text-white leading-none">{profile.bankDetails?.bankName || "—"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Account Protocol</p>
                  <p className="text-lg font-mono font-bold text-indigo-300">{profile.bankDetails?.accountNumber || "—"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">IFSC Signature</p>
                  <p className="text-lg font-mono font-bold text-indigo-300 uppercase">{profile.bankDetails?.ifsc || "—"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Statutory Regime</p>
                  <div>
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${profile.taxRegime === 'New' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                      {profile.taxRegime || "—"} Standard
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-8">
            {/* Assign Template Card */}
            <motion.div variants={itemVariants} className="premium-card p-8 rounded-3xl">
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-2">
                <MdShield className="text-indigo-400" /> Administrative Controls
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1">Salary Architecture</label>
                  <div className="relative group">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400" size={20} />
                    <Dropdown
                      options={templates.map(t => ({ value: t._id, label: t.name }))}
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      placeholder="Choose Protocol..."
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTemplateAssign}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                  disabled={!selectedTemplate}
                >
                  Apply Template Protocol
                </button>
              </div>
            </motion.div>

            {/* Navigation Actions */}
            <motion.div variants={itemVariants} className="bg-slate-950 p-8 rounded-3xl shadow-2xl text-white border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-black mb-8 tracking-tight">Institutional Operations</h3>
              <div className="space-y-3">
                <Link to={`/payroll-profile/edit/${employeeCode}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all group font-bold border border-white/5">
                  <span className="flex items-center gap-3"><MdEdit className="text-indigo-400" /> Edit Framework</span>
                  <MdArrowBack className="text-slate-500 group-hover:text-white transition-all rotate-180" size={18} />
                </Link>
                <Link to={`/salary-preview/${employeeCode}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all group font-bold border border-white/5">
                  <span className="flex items-center gap-3"><MdVisibility className="text-purple-400" /> View Projection</span>
                  <MdArrowBack className="text-slate-500 group-hover:text-white transition-all rotate-180" size={18} />
                </Link>
                <Link to={`/attendance/${employeeCode}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all group font-bold border border-white/5">
                  <span className="flex items-center gap-3"><MdCalendarToday className="text-amber-400" /> Attendance Ledger</span>
                  <MdArrowBack className="text-slate-500 group-hover:text-white transition-all rotate-180" size={18} />
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
