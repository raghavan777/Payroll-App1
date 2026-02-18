import { useEffect, useState } from "react";
import {
  getPayrollProfiles,
  deletePayrollProfile,
} from "../services/payrollApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdHistory,
  MdAccountBalance,
  MdPayments,
  MdSearch
} from "react-icons/md";

export default function PayrollProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const res = await getPayrollProfiles();
      setProfiles(res.data);
    } catch {
      toast.error("Failed to load payroll profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (employeeCode) => {
    if (!window.confirm("Are you sure you want to delete this financial profile?")) return;

    try {
      await deletePayrollProfile(employeeCode);
      toast.success("Financial profile removed");
      loadProfiles();
    } catch {
      toast.error("Process interrupted");
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
    p.employeeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Financial Profiles</h1>
          <p className="text-slate-200 font-medium mt-1">Configure compensation and tax structures for the team.</p>
        </div>

        <button
          onClick={() => navigate("/payroll-profile/create")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <MdAdd size={20} />
          <span>New Profile</span>
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="light-glass-card overflow-hidden flex flex-col">
        {/* Search & Stats Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="Filter by code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{profiles.length} Total Profiles</span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300 font-bold tracking-tight">Syncing financial records...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                <MdPayments size={48} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Profiles Active</h3>
              <p className="text-slate-400 max-w-xs mx-auto">Create a profile to begin managing compensation and statutory deductions.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-4 text-xs font-black text-indigo-200 uppercase tracking-widest">Employee Entity</th>
                  <th className="px-8 py-4 text-xs font-black text-indigo-200 uppercase tracking-widest text-center">Base Comp</th>
                  <th className="px-8 py-4 text-xs font-black text-indigo-200 uppercase tracking-widest text-center">Regime</th>
                  <th className="px-8 py-4 text-xs font-black text-indigo-200 uppercase tracking-widest text-center">Primary Bank</th>
                  <th className="px-8 py-4 text-xs font-black text-indigo-200 uppercase tracking-widest text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((p) => (
                  <tr key={p._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <p className="font-black text-white tracking-tight leading-none mb-1.5">{p.employeeName || "—"}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 uppercase tracking-wider">
                              {p.employeeCode}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {p._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-center">
                        <p className="text-sm font-black text-white">${p.salaryStructure?.basic?.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Monthly Basic</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${p.taxRegime === 'NEW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {p.taxRegime} SYSTEM
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2 text-slate-300">
                        <MdAccountBalance size={14} className="text-indigo-300" />
                        <span className="text-sm font-bold">{p.bankDetails?.bankName || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/payroll-profile/${p.employeeCode}`)}
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                          title="Quick View"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/payroll-profile/edit/${p.employeeCode}`)}
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
                          title="Edit Structure"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/attendance/${p.employeeCode}`)}
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-amber-600 transition-all active:scale-90"
                          title="Attendance History"
                        >
                          <MdHistory size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.employeeCode)}
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-rose-600 transition-all active:scale-90"
                          title="Archive Profile"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
