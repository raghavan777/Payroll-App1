import { useEffect, useState } from "react";
import { getEmployees } from "../api/employeeApi";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdPersonAdd,
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
  MdMailOutline,
  MdLayers,
  MdVisibility,
  MdEdit,
  MdReceipt,
  MdPeople
} from "react-icons/md";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const ITEMS_PER_PAGE = 8;

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data.employees || []);
    } catch (error) {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Actions */}
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">Team Matrix</h1>
          <p className="text-slate-200 font-medium mt-1">Institutional workforce synchronization and monitoring.</p>
        </div>

        <button
          onClick={() => navigate("/add-employee")}
          className="inline-flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-slate-900/20 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <MdPersonAdd size={24} className="relative z-10 text-indigo-400" />
          <span className="relative z-10 font-black uppercase tracking-widest text-xs">Onboard Member</span>
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="light-glass-card p-0 overflow-hidden relative border-none shadow-2xl">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-slate-200 bg-slate-100/30 backdrop-blur-sm">
          <div className="relative max-w-md group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 group-focus-within:scale-110 transition-all" size={24} />
            <input
              className="w-full bg-white/60 border border-white/50 pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold shadow-inner"
              placeholder="Filter by Identity or Protocol..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-indigo-900 font-black uppercase tracking-widest text-xs">Syncing workforce data...</p>
            </div>
          ) : currentEmployees.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100 shadow-inner">
                <MdPeople size={56} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Zero Protocols Found</h3>
              <p className="text-slate-400 max-w-xs mx-auto font-medium mt-2">No active identities match the central query.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-10 py-6 text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Identity Profile</th>
                  <th className="px-10 py-6 text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] text-center">Sector</th>
                  <th className="px-10 py-6 text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] text-center">Designation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] text-right">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentEmployees.map((emp, index) => (
                  <tr key={emp._id} className="hover:bg-white/5 transition-all group hover-lift" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300 font-black text-lg shadow-sm border border-white/10 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-white tracking-tight leading-none mb-1">{emp.name}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <span className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-indigo-500/20">{emp.employeeCode}</span>
                            <span className="flex items-center gap-1 text-slate-300"><MdMailOutline size={12} /> {emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-slate-200 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
                        <MdLayers size={14} className="text-indigo-300" />
                        {emp.department || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-sm font-bold text-white">{emp.designation || "Executive"}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveMenu(activeMenu === emp._id ? null : emp._id)}
                          className={`p-2 rounded-xl border transition-all active:scale-90 ${activeMenu === emp._id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-white shadow-sm border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600'}`}
                        >
                          <MdMoreVert size={20} />
                        </button>

                        {activeMenu === emp._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                              <div className="p-2 space-y-1">
                                <button
                                  onClick={() => navigate(`/payroll-profile/${emp.employeeCode}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
                                >
                                  <MdVisibility size={18} className="text-slate-400" />
                                  View Profile
                                </button>
                                <button
                                  onClick={() => navigate(`/payroll-profile/edit/${emp.employeeCode}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
                                >
                                  <MdEdit size={18} className="text-slate-400" />
                                  Edit Details
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                <button
                                  onClick={() => navigate(`/run-payroll?employee=${emp.employeeCode}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                >
                                  <MdReceipt size={18} />
                                  Issue Payroll
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-[32px]">
            <p className="text-sm font-bold text-slate-500">
              Showing <span className="text-slate-800">{indexOfFirst + 1}</span> to <span className="text-slate-800">{Math.min(indexOfLast, filteredEmployees.length)}</span> of <span className="text-slate-800">{filteredEmployees.length}</span> team members
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-90"
              >
                <MdChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-2 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-90"
              >
                <MdChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
