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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center md:text-left">Tax Declarations</h1>
          <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Global registry of filed tax declarations and calculated liabilities.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-center md:self-auto">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-2">
            <MdBusinessCenter size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{rows.length} Filed</span>
          </div>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
            <MdFilterList size={20} />
            <span className="text-sm">Advanced Filters</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold tracking-tight">Accessing declaration vault...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MdReceipt size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Declarations Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Either no declarations have been filed for this period or your search query yielded no results.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Fiscal Year</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Regime</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Taxable Income</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Liability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((d) => (
                  <tr key={d._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black tracking-tighter shadow-sm border border-indigo-100">
                          {d.employeeId?.employeeCode?.slice(-3) || "—"}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{d.employeeId?.name || "—"}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.employeeId?.employeeCode || "System Entity"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-sm font-black text-slate-600 font-mono tracking-tighter">{d.financialYear}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${d.selectedRegime === 'new' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {d.selectedRegime} REGIME
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono">
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-black text-slate-700">${d.taxableIncome?.toLocaleString()}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Adjusted Gross</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-mono">
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-black text-rose-600">${d.calculatedTax?.toLocaleString()}</p>
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">Est. Annual Tax</span>
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
