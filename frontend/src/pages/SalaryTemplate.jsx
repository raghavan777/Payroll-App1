import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
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

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/salary-template");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this framework? This action cannot be undone.")) return;

    try {
      await api.delete(`/api/salary-template/${id}`);
      toast.success("Framework deleted successfully");
      loadTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete framework");
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Compensation Frameworks</h1>
          <p className="text-slate-300 font-medium italic text-sm tracking-wide">Modular institutional blueprints for automated salary structure generation.</p>
        </div>

        <button
          onClick={() => navigate("/salary-template/create")}
          className="group relative inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-2xl shadow-[0_15px_40px_rgba(79,70,229,0.4)] active:scale-95 transition-all text-xs uppercase tracking-widest overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <MdAdd size={22} className="relative z-10" />
          <span className="relative z-10">Generate Architecture</span>
        </button>
      </div>

      {/* Modern Table Container */}
      <div className="premium-card rounded-[32px] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        {/* Search Bar */}
        <div className="p-8 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="relative max-w-md w-full group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
            <input
              className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-black text-white text-xs uppercase tracking-widest"
              placeholder="Search institutional blueprints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">{templates.length} Core Systems</span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing architecture...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5 shadow-inner">
                <MdAccountTree size={56} className="opacity-40" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Architecture Void</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Build modular templates to standardize salary components across your organization.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse cursor-default">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Blueprint System</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Component Breakdown</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Logic Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTemplates.map((t) => (
                  <tr key={t._id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center font-black tracking-tighter shadow-2xl border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-white tracking-tight text-base mb-1 group-hover:text-indigo-300 transition-colors uppercase">{t.name}</p>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">FW-ID: {t._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex flex-col items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl shadow-inner group-hover:border-indigo-500/20 transition-colors">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">Basic Core</span>
                          <span className="text-xs font-black text-indigo-400 font-mono tracking-tight">{t.basicPercent}%</span>
                        </div>
                        <div className="flex flex-col items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl shadow-inner group-hover:border-indigo-500/20 transition-colors">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">HRA Housing</span>
                          <span className="text-xs font-black text-indigo-400 font-mono tracking-tight">{t.hraPercent}%</span>
                        </div>
                        <div className="flex flex-col items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl shadow-inner group-hover:border-indigo-500/20 transition-colors">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">Spec. Allow.</span>
                          <span className="text-xs font-black text-indigo-400 font-mono tracking-tight">{t.allowancePercent}%</span>
                        </div>
                        <div className="w-px bg-white/5 h-10 mx-1"></div>
                        <div className="flex flex-col items-center px-4 py-2 bg-rose-500/5 border border-rose-500/10 rounded-xl shadow-inner group-hover:border-rose-500/20 transition-colors">
                          <span className="text-[8px] font-black text-rose-300/40 uppercase tracking-tighter mb-1">Tax Shield</span>
                          <span className="text-xs font-black text-rose-500 font-mono tracking-tight">{t.taxPercent}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="p-3 bg-white/5 hover:bg-indigo-500/10 rounded-2xl border border-white/5 hover:border-indigo-500/20 text-slate-500 hover:text-indigo-400 transition-all active:scale-95 shadow-xl group/btn"
                          title="Recalibrate Logic"
                          onClick={() => navigate(`/salary-template/edit/${t._id}`)}
                        >
                          <MdEdit size={20} className="group-hover/btn:rotate-12 transition-transform" />
                        </button>
                        <button
                          className="p-3 bg-white/5 hover:bg-rose-500/10 rounded-2xl border border-white/5 hover:border-rose-500/20 text-slate-500 hover:text-rose-400 transition-all active:scale-95 shadow-xl group/btn"
                          title="Decommission Framework"
                          onClick={() => handleDelete(t._id)}
                        >
                          <MdDelete size={20} className="group-hover/btn:scale-110 transition-transform" />
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
