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
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <MdArrowBack size={20} />
          </div>
          <span>Back to Team</span>
        </button>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Onboard Member</h1>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-10 lg:p-12">
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-800 mb-2">Primary Information</h2>
          <p className="text-slate-500 font-medium">Enter the essential details to create the professional identity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Alexander Pierce"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
            <div className="relative group">
              <MdAlternateEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="e.g. alex@company.com"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
            <div className="relative group">
              <MdVpnKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <div className="relative group">
              <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="department"
                value={form.department}
                onChange={updateField}
                placeholder="e.g. Engineering"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Role</label>
            <div className="relative group">
              <MdWork className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="designation"
                value={form.designation}
                onChange={updateField}
                placeholder="e.g. Senior Backend Dev"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Date of Joining */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Date</label>
            <div className="relative group">
              <MdEventAvailable className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                name="dateOfJoining"
                type="date"
                value={form.dateOfJoining}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Generated Code Display */}
        {generatedemployeeCode && (
          <div className="mt-10 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <MdFingerprint size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Permanent Employee Code</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{generatedemployeeCode}</p>
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
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel Process
          </button>
          <button
            onClick={createEmployee}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <MdSave size={20} />
                <span>Complete Onboarding</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
