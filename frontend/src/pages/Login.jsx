import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLogin, MdEmail, MdLockOutline, MdArrowForward } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-inter">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[460px] px-6 z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[28px] shadow-2xl shadow-indigo-500/40 mb-8 border border-white/10"
          >
            <MdLogin className="text-white text-4xl" />
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 text-gradient">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-lg font-medium opacity-80 uppercase tracking-[0.2em] text-[12px]">
            Institutional Portal Access
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-morphic border border-white/10 p-10 lg:p-12 space-y-8 rounded-[48px]"
        >
          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Universal Identity</label>
            <div className="relative group">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="email"
                className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4.5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                placeholder="identity@institution.com"
                {...register("email", { required: "Identity required" })}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cryptographic Key</label>
            <div className="relative group">
              <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="password"
                className="w-full bg-slate-900/40 border border-slate-800 text-white pl-12 pr-4 py-4.5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                placeholder="••••••••"
                {...register("password", { required: "Authorization key required" })}
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 text-[11px] font-bold pl-1 uppercase tracking-wider"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4.5 rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-lg"
          >
            {isSubmitting ? (
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Establish Session</span>
                <MdArrowForward className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="pt-6 text-center border-t border-white/5">
            <p className="text-slate-500 font-medium text-sm">
              New entity?{" "}
              <Link
                to="/register-org"
                className="text-indigo-400 hover:text-indigo-300 font-black transition-all underline underline-offset-8 decoration-2 hover:decoration-indigo-300"
              >
                Register Institution
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-center opacity-30"
        >
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            Institutional Core Nexus • v4.2.0 • SHA-512 Secure
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
