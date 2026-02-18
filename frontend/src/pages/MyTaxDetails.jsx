import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getMyDeclaration } from "../services/taxService";
import DownloadTaxButton from "../components/DownloadTaxButton";
import {
  MdAccountBalance,
  MdTrendingUp,
  MdAttachMoney,
  MdCalculate,
  MdVerifiedUser,
  MdCalendarToday
} from "react-icons/md";

export default function MyTaxDetails() {
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyDeclaration();
        setDeclaration(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load tax details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing fiscal records...</p>
      </div>
    );
  }

  if (!declaration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 text-slate-600 border border-white/5 shadow-inner">
          <MdAccountBalance size={56} className="opacity-40" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No Settlement Data</h3>
        <p className="text-slate-400 max-w-xs text-center text-xs font-medium uppercase tracking-widest leading-relaxed">You haven't submitted any institutional tax declarations for the current cycle.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Income",
      value: `₹${declaration.totalIncome?.toLocaleString('en-IN') || '0'}`,
      icon: MdAttachMoney,
      gradient: "from-emerald-400 to-teal-500",
      accent: "emerald"
    },
    {
      label: "Institutional Investments",
      value: `₹${declaration.investments?.toLocaleString('en-IN') || '0'}`,
      icon: MdTrendingUp,
      gradient: "from-blue-400 to-indigo-500",
      accent: "indigo"
    },
    {
      label: "Net Taxable Base",
      value: `₹${declaration.taxableIncome?.toLocaleString('en-IN') || '0'}`,
      icon: MdCalculate,
      gradient: "from-amber-400 to-orange-500",
      accent: "amber"
    },
    {
      label: "Aggregated Liability",
      value: `₹${declaration.calculatedTax?.toLocaleString('en-IN') || '0'}`,
      icon: MdAccountBalance,
      gradient: "from-rose-400 to-pink-500",
      accent: "rose"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden premium-card border-none p-10 lg:p-14 text-white shadow-2xl animate-slide-in-up">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white border border-white/20 shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
              <MdVerifiedUser size={42} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-2 leading-none">Fiscal Terminal</h1>
              <p className="text-slate-400 font-medium italic text-sm tracking-wide">Aggregated institutional settlement and liability engine</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2 px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Institutional Cycle</span>
              <span className="font-black text-white text-base tracking-widest">FY {declaration.financialYear}</span>
            </div>
            <div className="flex flex-col gap-2 px-8 py-4 bg-emerald-500/5 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Active Regime</span>
              <span className="font-black text-emerald-300 text-base uppercase tracking-widest">{declaration.selectedRegime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="premium-card rounded-[32px] p-8 hover:scale-[1.03] transition-all duration-500 group cursor-default overflow-hidden relative border border-white/10"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.accent}-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2`}></div>

            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-[22px] bg-white/5 flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={30} className={`text-${stat.accent}-400 shadow-[0_0_20px_rgba(var(--${stat.accent}-rgb),0.3)]`} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
              <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Download Section */}
      <div className="premium-card rounded-[40px] p-10 lg:p-12 animate-slide-in-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-indigo-400 shadow-inner">
              <MdAccountBalance size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Institutional Settlement Archival</h3>
              <p className="text-slate-400 font-medium italic text-sm">Download your aggregated institutional tax computation PDF</p>
            </div>
          </div>
          <DownloadTaxButton
            declarationId={declaration._id}
            fileName={`tax-statement-${declaration.financialYear}.pdf`}
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in-up pb-12" style={{ animationDelay: '0.3s' }}>
          <div className="premium-card rounded-[32px] p-10 border border-white/5">
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-8">Statutory Breakdown protocol</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Aggregated Gross</span>
                <span className="text-base font-black text-white tracking-tighter tabular-nums">₹{declaration.totalIncome?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Statutory Exemptions</span>
                <span className="text-base font-black text-emerald-400 tracking-tighter tabular-nums">-₹{declaration.investments?.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <div className="flex justify-between items-center p-6 bg-indigo-500/10 rounded-[28px] border border-indigo-500/20 shadow-2xl">
                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Net Taxable Architecture</span>
                <span className="text-lg font-black text-white tracking-tighter tabular-nums">₹{declaration.taxableIncome?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="premium-card rounded-[32px] p-10 border border-white/5">
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-8">Registration Status Hub</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-emerald-500/5 transition-all group">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-xl group-hover:scale-110 transition-transform">
                  <MdVerifiedUser size={28} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Status</p>
                  <p className="text-base font-black text-white tracking-tight">System Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-indigo-500/5 transition-all group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl group-hover:scale-110 transition-transform">
                  <MdCalendarToday size={28} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fiscal Lifecycle</p>
                  <p className="text-base font-black text-white tracking-tight">Active for {declaration.financialYear}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-purple-500/5 transition-all group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-xl group-hover:scale-110 transition-transform">
                  <MdAccountBalance size={28} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Institutional Regime</p>
                  <p className="text-base font-black text-white tracking-tight">{declaration.selectedRegime?.toUpperCase()} PROTOCOL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
