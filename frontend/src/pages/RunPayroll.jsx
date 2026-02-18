import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdPlayCircleFilled,
  MdPerson,
  MdDateRange,
  MdPublic,
  MdMap,
  MdSettingsSuggest,
  MdShield
} from "react-icons/md";

export default function RunPayroll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [employeeCode, setEmployeeCode] = useState("");
  const [country] = useState("India");
  const [state] = useState("TamilNadu");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleRunPayroll = async () => {
    if (!employeeCode || !startDate || !endDate) {
      return toast.error("Deployment parameters incomplete");
    }

    try {
      setLoading(true);
      await api.post("/api/payroll/run", {
        employeeCode,
        country,
        state,
        startDate,
        endDate,
      });

      toast.success("Computation cycle initiated successfully");
      navigate("/payroll-preview");

    } catch (err) {
      toast.error(err.response?.data?.message || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">Execute Payroll</h1>
          <p className="text-slate-300 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">Institutional Wealth Synchronization Cycle</p>
        </div>
      </div>

      <div className="premium-card p-10 lg:p-14 relative overflow-hidden border-none shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/10 relative z-10">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-md text-indigo-400 rounded-3xl flex items-center justify-center border border-white/10 shadow-xl">
            <MdSettingsSuggest size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-none mb-2">Cycle Protocol</h2>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Deployment Parameters</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Employee Code */}
          <div className="space-y-4">
            <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Entity Reference (Code)</label>
            <div className="relative group">
              <MdPerson size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all font-inter" />
              <input
                className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-2xl focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-white uppercase tracking-widest shadow-inner placeholder:text-slate-600"
                placeholder="e.g. EMP001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Start Date */}
            <div className="space-y-4">
              <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Cycle Inception</label>
              <div className="relative group">
                <MdDateRange size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all font-inter" />
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-2xl focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-white shadow-inner [color-scheme:dark]"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-4">
              <label className="text-xs font-black text-indigo-300 uppercase tracking-widest ml-1">Cycle Conclusion</label>
              <div className="relative group">
                <MdDateRange size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all font-inter" />
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-5 rounded-2xl focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-white shadow-inner [color-scheme:dark]"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Regional Context Info */}
          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 italic text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <MdPublic size={16} className="text-indigo-400" />
              <span className="text-white">{country}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-2">
              <MdMap size={16} className="text-indigo-400" />
              <span className="text-white">{state} Jurisdiction</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <MdShield size={16} className="text-emerald-400" />
              <span className="text-emerald-400">Auto-Enforcement</span>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10">
            <button
              onClick={handleRunPayroll}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-[32px] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdPlayCircleFilled size={28} className="relative z-10 text-white" />
                  <span className="relative z-10">Initiate Computation Cycle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
