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
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Team Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor your global workforce.</p>
        </div>

        <button
          onClick={() => navigate("/add-employee")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <MdPersonAdd size={20} />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="Search by name, email, or code..."
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
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold">Retrieving team data...</p>
            </div>
          ) : currentEmployees.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MdPeople size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Employees Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any team members matching your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Employee</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Department</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Designation</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm border border-slate-200 group-hover:bg-white group-hover:shadow-md transition-all">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{emp.name}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-indigo-100">{emp.employeeCode}</span>
                            <span className="flex items-center gap-1"><MdMailOutline size={12} /> {emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest border border-slate-200">
                        <MdLayers size={14} className="text-slate-400" />
                        {emp.department || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-sm font-bold text-slate-600">{emp.designation || "Executive"}</p>
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
                                  onClick={() => navigate(`/payroll-profiles/view/${emp._id}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
                                >
                                  <MdVisibility size={18} className="text-slate-400" />
                                  View Profile
                                </button>
                                <button
                                  onClick={() => navigate(`/payroll-profiles/edit/${emp._id}`)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
                                >
                                  <MdEdit size={18} className="text-slate-400" />
                                  Edit Details
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                <button
                                  onClick={() => navigate(`/run-payroll?employee=${emp._id}`)}
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
