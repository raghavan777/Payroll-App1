import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  getStatutoryConfigs,
  createStatutoryConfig,
  updateStatutoryConfig,
  deleteStatutoryConfig
} from "../services/statutoryService";
import {
  MdShield,
  MdPublic,
  MdMap,
  MdPercent,
  MdAttachMoney,
  MdSave,
  MdEdit,
  MdDelete,
  MdAdd,
  MdClose,
  MdInfoOutline
} from "react-icons/md";

export default function StatutoryConfig() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await getStatutoryConfigs();
      setConfigs(data);
    } catch (err) {
      toast.error("Failed to load statutory configurations");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingConfig) {
        await updateStatutoryConfig(editingConfig._id, data);
        toast.success("Configuration updated successfully");
      } else {
        await createStatutoryConfig(data);
        toast.success("Regulatory parameters synchronized");
      }
      reset();
      setIsModalOpen(false);
      setEditingConfig(null);
      fetchConfigs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal synchronization failure");
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    Object.keys(config).forEach(key => {
      setValue(key, config[key]);
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this configuration?")) return;
    try {
      await deleteStatutoryConfig(id);
      toast.success("Configuration deleted");
      fetchConfigs();
    } catch (err) {
      toast.error("Failed to delete configuration");
    }
  };

  const openAddModal = () => {
    setEditingConfig(null);
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Institutional Compliance</h1>
          <p className="text-slate-200 font-medium mt-1">Manage global and regional statutory parameters.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
        >
          <MdAdd size={24} />
          <span>New Framework</span>
        </button>
      </div>

      {/* List View */}
      <div className="light-glass-card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Synchronizing with Global Repository...
          </div>
        ) : configs.length === 0 ? (
          <div className="p-20 text-center">
            <MdShield size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No Statutory Frameworks Established</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest">Jurisdiction</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest text-center">PF (%)</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest text-center">ESI (%)</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest text-center">Prof. Tax</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {configs.map((config) => (
                  <tr key={config._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                          {config.country.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-white">{config.country}</p>
                          <p className="text-xs font-bold text-slate-300 uppercase">{config.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-slate-200">{config.pfPercentage}%</td>
                    <td className="px-8 py-6 text-center font-bold text-slate-200">{config.esiPercentage}%</td>
                    <td className="px-8 py-6 text-center font-bold text-slate-200">{config.professionalTax}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-2 text-indigo-400 hover:bg-white hover:text-indigo-600 rounded-lg shadow-sm transition-all"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(config._id)}
                          className="p-2 text-rose-400 hover:bg-white hover:text-rose-600 rounded-lg shadow-sm transition-all"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Overlay Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl z-[70] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <MdShield size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 leading-none mb-1">
                      {editingConfig ? "Modify Framework" : "Establish Framework"}
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      {editingConfig ? "Update Configuration" : "New Statutory Set"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-800 rounded-full transition-all"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jurisdiction (Country)</label>
                    <div className="relative">
                      <MdPublic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        placeholder="e.g. India"
                        {...register("country", { required: true })}
                        readOnly={!!editingConfig}
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Region (State)</label>
                    <div className="relative">
                      <MdMap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        placeholder="e.g. Tamil Nadu"
                        {...register("state", { required: true })}
                        readOnly={!!editingConfig}
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
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 h-14"
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
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 h-14"
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
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 h-14"
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
                        <span>{editingConfig ? "Save Changes" : "Deploy Config"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
        <MdInfoOutline className="text-indigo-400 mt-1" size={20} />
        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
          Statutory parameters established here govern the base logic for payroll computational runs. modifications are logged and will take effect for the current active cycle.
        </p>
      </div>
    </div>
  );
}
