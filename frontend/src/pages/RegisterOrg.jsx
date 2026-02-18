import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  MdBusiness,
  MdPublic,
  MdLanguage,
  MdPerson,
  MdEmail,
  MdLockOutline,
  MdArrowForward,
  MdShield,
  MdVerifiedUser
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import AtmosphericBackground from "../components/AtmosphericBackground";

export default function RegisterOrg() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register-org", data);
      toast.success("Institutional profile established successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol error: Registration failed");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 font-inter">
      {/* UNIFIED ATMOSPHERIC BACKGROUND */}
      <AtmosphericBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[600px] z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12 relative">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5, boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[32px] shadow-2xl shadow-indigo-500/40 mb-8 border border-white/10 relative z-10"
          >
            <MdBusiness className="text-white text-5xl drop-shadow-lg" />
            <div className="absolute inset-0 bg-white/20 rounded-[32px] blur-lg -z-10 opacity-50"></div>
          </motion.div>
          <motion.h1
            className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Institutional Onboarding
          </motion.h1>
          <p className="text-indigo-200 text-lg font-medium opacity-90 uppercase tracking-[0.3em] text-[12px] drop-shadow-md">
            Establish Digital Financial Infrastructure
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-morphic border border-white/10 p-8 lg:p-14 space-y-10 rounded-[56px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          {/* Section: Organization Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <MdShield className="text-indigo-400" size={20} />
              </div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Institutional Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <div className="relative group">
                  <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Official Institution Name"
                    {...register("orgName", { required: "Name required" })}
                  />
                </div>
                {errors.orgName && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.orgName.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <MdPublic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Jurisdiction"
                    {...register("country", { required: "Country required" })}
                  />
                </div>
                {errors.country && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.country.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <MdLanguage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Domain Sector"
                    {...register("domain", { required: "Domain required" })}
                  />
                </div>
                {errors.domain && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.domain.message}</p>}
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-white/5"></div>

          {/* Section: Admin Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <MdVerifiedUser className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Primary Authorization</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  <input
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Controller Full Name"
                    {...register("adminName", { required: "Admin name required" })}
                  />
                </div>
                {errors.adminName && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.adminName.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  <input
                    type="email"
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Institutional Email"
                    {...register("adminEmail", {
                      required: "Email required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid protocol" }
                    })}
                  />
                </div>
                {errors.adminEmail && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.adminEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  <input
                    type="password"
                    className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                    placeholder="Authorization Key"
                    {...register("password", {
                      required: "Key required",
                      minLength: { value: 6, message: "Min 6 chars" }
                    })}
                  />
                </div>
                {errors.password && <p className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider">{errors.password.message}</p>}
              </div>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-4 text-xl"
          >
            {isSubmitting ? (
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Commence Onboarding</span>
                <MdArrowForward className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 font-medium text-sm">
              Current partner?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-black transition-all underline underline-offset-8 decoration-2 hover:decoration-white">
                Institutional Login
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-16 text-center opacity-30">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
            Institutional Core Gateway • v4.2.0 • Encryption Level: AES-256
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
