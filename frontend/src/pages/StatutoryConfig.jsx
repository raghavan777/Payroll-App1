import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MdShield,
  MdPublic,
  MdMap,
  MdPercent,
  MdAttachMoney,
  MdSave,
  MdInfoOutline,
  MdLayers
} from "react-icons/md";

export default function StatutoryConfig() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/statutory/statutory", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Regulatory parameters synchronized");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal synchronization failure");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Institutional Compliance</h1>
        <p className="text-slate-500 font-medium mt-1">Configure statutory slabs and jurisdictional regulatory parameters.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8 lg:p-10">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MdShield size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none mb-1">Statutory Framework</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global & Regional Slabs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jurisdiction (Country)</label>
              <div className="relative">
                <MdPublic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="e.g. India"
                  {...register("country", { required: true })}
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Region (State)</label>
              <div className="relative">
                <MdMap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="e.g. Tamil Nadu"
                  {...register("state", { required: true })}
                />
              </div>
            </div>

            {/* PF % */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Provident Fund (PF %)</label>
              <div className="relative">
                <MdPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="12.00"
                  {...register("pfPercentage", { required: true })}
                />
              </div>
            </div>

            {/* ESI % */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">State Insurance (ESI %)</label>
              <div className="relative">
                <MdPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="0.75"
                  {...register("esiPercentage", { required: true })}
                />
              </div>
            </div>

            {/* Professional Tax */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Tax (Fixed)</label>
              <div className="relative">
                <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="200"
                  {...register("professionalTax", { required: true })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-slate-800 text-white font-black px-8 py-5 rounded-[24px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <MdSave size={24} className="group-hover:translate-y-px" />
                  <span>Update Framework Parameters</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
          <MdInfoOutline className="text-indigo-400 mt-1" size={20} />
          <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
            Updates to statutory parameters will affect all subsequent payroll computational runs. Retrospective calculation adjustments require manual ledger synchronization.
          </p>
        </div>
      </div>
    </div>
  );
}
