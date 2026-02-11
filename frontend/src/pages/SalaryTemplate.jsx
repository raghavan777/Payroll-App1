import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MdAdd,
  MdAccountTree,
  MdSearch,
  MdEdit,
  MdDelete,
  MdBarChart,
  MdLayers
} from "react-icons/md";

export default function SalaryTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/salary-template", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data);
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Compensation Frameworks</h1>
          <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Modular blueprints for automated salary structure generation.</p>
        </div>

        <button
          onClick={() => navigate("/salary-template/create")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-sm self-center md:self-auto"
        >
          <MdAdd size={20} />
          <span>New Framework</span>
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="Search frameworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{templates.length} Blueprints</span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold tracking-tight">Syncing architecture...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MdAccountTree size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Frameworks Defined</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Build modular templates to standardize salary components across your organization.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Blueprint Name</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Breakdown</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTemplates.map((t) => (
                  <tr key={t._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black tracking-tighter shadow-sm">
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{t.name}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FW-ID: {t._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Basic</span>
                          <span className="text-xs font-black text-indigo-600">{t.basicPercent}%</span>
                        </div>
                        <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">HRA</span>
                          <span className="text-xs font-black text-indigo-600">{t.hraPercent}%</span>
                        </div>
                        <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">S.A.</span>
                          <span className="text-xs font-black text-indigo-600">{t.allowancePercent}%</span>
                        </div>
                        <div className="w-1 bg-slate-100 h-6"></div>
                        <div className="flex flex-col items-center px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Tax</span>
                          <span className="text-xs font-black text-rose-500">{t.taxPercent}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600 transition-all active:scale-95"
                          title="Edit Logic"
                          onClick={() => navigate(`/salary-template/edit/${t._id}`)}
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-rose-600 transition-all active:scale-95"
                          title="Delete Blueprint"
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
