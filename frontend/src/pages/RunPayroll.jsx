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
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Execute Payroll</h1>
        <p className="text-slate-500 font-medium mt-1">Initiate a standardized financial computation cycle for an entity.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MdSettingsSuggest size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none mb-1">Cycle Protocol</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Execution Parameters</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Employee Code */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Entity Reference (Code)</label>
            <div className="relative group">
              <MdPerson size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 uppercase tracking-widest"
                placeholder="e.g. EMP001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Inception</label>
              <div className="relative group">
                <MdDateRange size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 font-mono"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Conclusion</label>
              <div className="relative group">
                <MdDateRange size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 font-mono"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Regional Context Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <MdPublic size={14} className="text-indigo-300" />
              <span>{country}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
            <div className="flex items-center gap-1">
              <MdMap size={14} className="text-indigo-300" />
              <span>{state} Jurisdiction</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <MdShield size={14} className="text-emerald-400" />
              <span className="text-emerald-500">Auto-Enforcement</span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <button
              onClick={handleRunPayroll}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-3xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdPlayCircleFilled size={24} />
                  <span>Initiate Computation Cycle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
