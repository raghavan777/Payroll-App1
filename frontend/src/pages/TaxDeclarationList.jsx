import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getDeclarations } from "../services/taxService";
import {
  MdReceipt,
  MdSearch,
  MdFilterList,
  MdAttachMoney,
  MdBusinessCenter,
  MdPayments
} from "react-icons/md";

export default function TaxDeclarationList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDeclarations();
      setRows(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = rows.filter(d =>
    d.employeeId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.employeeId?.employeeCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-3">Compliance Registry</h1>
          <p className="text-slate-400 font-medium italic text-sm tracking-wide">Global institutional registry of filed tax declarations and liability calculations.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl text-indigo-300 font-black text-[10px] uppercase tracking-[0.3em]">
          <MdPayments size={22} className="animate-pulse" />
          <span>{rows.length} Active Declarations</span>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="premium-card rounded-[32px] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        {/* Filter Bar */}
        <div className="p-8 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="relative max-w-md w-full group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
            <input
              className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-black text-white text-xs uppercase tracking-widest"
              placeholder="Filter by name or protocol code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-300 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">
            <MdFilterList size={22} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Enhanced Filters</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing declaration vault...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-600 border border-white/5 shadow-inner">
                <MdReceipt size={56} className="opacity-40" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Vault Empty</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">Either no declarations have been filed for this period or your search query yielded no results.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse cursor-default">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Institutional Member</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Fiscal Period</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-center">Compliance Regime</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Taxable Income</th>
                  <th className="px-8 py-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] text-right">Liability Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRows.map((d) => (
                  <tr key={d._id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center font-black tracking-tighter shadow-2xl border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                          {d.employeeId?.employeeCode?.slice(-3) || "—"}
                        </div>
                        <div>
                          <p className="font-black text-white tracking-tight text-base mb-1 group-hover:text-indigo-300 transition-colors uppercase">{d.employeeId?.name || "—"}</p>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{d.employeeId?.employeeCode || "System Entity"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <p className="text-base font-black text-slate-300 font-mono tracking-widest">{d.financialYear}</p>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <span className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg backdrop-blur-md ${d.selectedRegime === 'new' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20'
                        }`}>
                        {d.selectedRegime} REGIME
                      </span>
                    </td>
                    <td className="px-8 py-7 text-right font-mono">
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-black text-white group-hover:text-indigo-200 transition-colors tracking-tighter">₹{d.taxableIncome?.toLocaleString()}</p>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Adjusted Gross</span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right font-mono">
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-black text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)] tracking-tighter">₹{d.calculatedTax?.toLocaleString()}</p>
                        <span className="text-[9px] font-black text-rose-300/40 uppercase tracking-[0.2em]">Est. Annual Tax</span>
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
