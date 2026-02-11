import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MdPublic,
  MdMap,
  MdTrendingUp,
  MdTrendingDown,
  MdPercent,
  MdSave,
  MdAccountBalanceWallet
} from "react-icons/md";

export default function TaxSlab() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/statutory/tax-slab", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Tax Regulation created successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add regulatory slab");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Define Tax Slab</h1>
        <p className="text-slate-500 font-medium mt-1">Establish regional tax regulations and progressive slab structures.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MdAccountBalanceWallet size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none mb-1">Regulation Details</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Slab Configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
              <div className="relative group">
                <MdPublic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700"
                  placeholder="e.g. United States"
                  {...register("country")}
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">State / Region</label>
              <div className="relative group">
                <MdMap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700"
                  placeholder="e.g. California"
                  {...register("state")}
                />
              </div>
            </div>

            {/* Min Income */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Income</label>
              <div className="relative group">
                <MdTrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700 font-mono"
                  placeholder="0.00"
                  type="number"
                  {...register("minIncome")}
                />
              </div>
            </div>

            {/* Max Income */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Income</label>
              <div className="relative group">
                <MdTrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700 font-mono"
                  placeholder="No Limit"
                  type="number"
                  {...register("maxIncome")}
                />
              </div>
            </div>

            {/* Tax % */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tax Percentage (%)</label>
              <div className="relative group">
                <MdPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 font-black text-slate-800 text-lg"
                  placeholder="e.g. 15"
                  type="number"
                  step="0.01"
                  {...register("taxPercentage")}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-3xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} />
                  <span>Enforce Regulation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
