import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSave,
  MdPerson,
  MdAlternateEmail,
  MdVpnKey,
  MdBusiness,
  MdWork,
  MdEventAvailable,
  MdFingerprint
} from "react-icons/md";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    dateOfJoining: ""
  });

  const [generatedemployeeCode, setGeneratedemployeeCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEmployee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/employees",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGeneratedemployeeCode(res.data.employeeCode);
      toast.success("Team member added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-white hover:text-indigo-400 font-black transition-all group"
        >
          <div className="p-2.5 rounded-xl group-hover:bg-white/10 transition-all">
            <MdArrowBack size={20} />
          </div>
          <span className="uppercase tracking-widest text-[10px]">Back to Team</span>
        </button>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Onboard Member</h1>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="mb-10">
          <h2 className="text-xl font-black text-white mb-2">Primary Information</h2>
          <p className="text-slate-300 font-medium">Enter the essential details to create the professional identity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Alexander Pierce"
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Work Email</label>
            <div className="relative group">
              <MdAlternateEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="e.g. alex@company.com"
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Temporary Password</label>
            <div className="relative group">
              <MdVpnKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••"
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Department</label>
            <div className="relative group">
              <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="department"
                value={form.department}
                onChange={updateField}
                placeholder="e.g. Engineering"
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Professional Role</label>
            <div className="relative group">
              <MdWork className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="designation"
                value={form.designation}
                onChange={updateField}
                placeholder="e.g. Senior Backend Dev"
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>

          {/* Date of Joining */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Engagement Date</label>
            <div className="relative group">
              <MdEventAvailable className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="dateOfJoining"
                type="date"
                value={form.dateOfJoining}
                onChange={updateField}
                className="w-full bg-white/40 border border-white/40 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Generated Code Display */}
        {generatedemployeeCode && (
          <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <MdFingerprint size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-indigo-300 uppercase tracking-widest leading-none mb-1">Permanent Employee Code</p>
                <p className="text-2xl font-black text-white tracking-tight">{generatedemployeeCode}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/employees")}
              className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
            >
              Verify in List
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95"
          >
            Cancel Process
          </button>
          <button
            onClick={createEmployee}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <MdSave size={20} className="text-indigo-400" />
                <span>Establish Identity</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
