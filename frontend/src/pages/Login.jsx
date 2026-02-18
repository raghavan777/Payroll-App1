import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLogin, MdEmail, MdLockOutline, MdArrowForward } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import AtmosphericBackground from "../components/AtmosphericBackground";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      const token = res.data?.accessToken || res.data?.token || res.data?.data?.token;

      if (!token) {
        toast.error("Authentication failed: token not received");
        return;
      }

      login(token);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-inter">
      {/* UNIFIED ATMOSPHERIC BACKGROUND */}
      <AtmosphericBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[460px] px-6 z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12 relative">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5, boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[28px] shadow-2xl shadow-indigo-500/40 mb-8 border border-white/10 relative z-10"
          >
            <MdLogin className="text-white text-5xl drop-shadow-lg" />
            <div className="absolute inset-0 bg-white/20 rounded-[28px] blur-lg -z-10 opacity-50"></div>
          </motion.div>
          <motion.h1
            className="text-6xl font-black text-white tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Welcome Back
          </motion.h1>
          <p className="text-indigo-200 text-lg font-medium opacity-90 uppercase tracking-[0.2em] text-[12px] drop-shadow-md">
            Institutional Portal Access
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-morphic border border-white/10 p-10 lg:p-12 space-y-8 rounded-[48px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Universal Identity</label>
            <div className="relative group">
              <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" size={22} />
              <input
                type="email"
                className="w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium hover:border-slate-600/80 shadow-inner"
                placeholder="identity@institution.com"
                {...register("email", { required: "Identity required" })}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0, x: -10 }}
                  animate={{ opacity: 1, height: "auto", x: 0 }}
                  exit={{ opacity: 0, height: 0, x: -10 }}
                  className="text-rose-400 text-[11px] font-bold pl-2 uppercase tracking-wider flex items-center gap-1 mt-1"
                >
                  <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Cryptographic Key</label>
            <div className="relative group">
              <MdLockOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" size={22} />
              <input
                type="password"
                className="w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium hover:border-slate-600/80 shadow-inner"
                placeholder="••••••••"
                {...register("password", { required: "Authorization key required" })}
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0, x: -10 }}
                  animate={{ opacity: 1, height: "auto", x: 0 }}
                  exit={{ opacity: 0, height: 0, x: -10 }}
                  className="text-rose-400 text-[11px] font-bold pl-2 uppercase tracking-wider flex items-center gap-1 mt-1"
                >
                  <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-lg border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out blur-md"></div>
            {isSubmitting ? (
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="relative z-10">Establish Session</span>
                <MdArrowForward className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="pt-8 text-center border-t border-white/5 relative">
            <p className="text-slate-500 font-medium text-sm">
              New entity?{" "}
              <Link
                to="/register-org"
                className="text-purple-400 hover:text-white font-bold transition-all relative inline-block group"
              >
                Register Institution
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-center opacity-40 mix-blend-plus-lighter"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] drop-shadow-lg">
            Institutional Core Nexus • v4.2.0 • SHA-512 Secure
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
