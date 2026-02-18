import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { MdPersonAdd, MdEmail, MdLockOutline, MdPersonOutline, MdArrowForward } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      toast.success("Account created! Welcome to the team.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[480px] px-6 z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-10 relative">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-[28px] shadow-2xl shadow-emerald-500/40 mb-6 border border-white/10 relative z-10"
          >
            <MdPersonAdd className="text-white text-5xl drop-shadow-lg" />
            <div className="absolute inset-0 bg-white/20 rounded-[28px] blur-lg -z-10 opacity-50"></div>
          </motion.div>
          <motion.h1
            className="text-5xl font-black text-white tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 drop-shadow-sm"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Join Our Team
          </motion.h1>
          <p className="text-emerald-200 text-lg font-medium opacity-90 uppercase tracking-[0.2em] text-[12px] drop-shadow-md">
            Create your professional profile
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-morphic border border-white/10 p-10 lg:p-12 space-y-6 rounded-[48px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* Full Name */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Full Name</label>
            <div className="relative group">
              <MdPersonOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" size={20} />
              <input
                className="w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium hover:border-slate-600/80 shadow-inner"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <p className="text-rose-400 text-[11px] font-bold pl-2 uppercase tracking-wider flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>
                {errors.name.message}
              </p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Work Email</label>
            <div className="relative group">
              <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" size={20} />
              <input
                type="email"
                className="w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium hover:border-slate-600/80 shadow-inner"
                placeholder="john@company.com"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-[11px] font-bold pl-2 uppercase tracking-wider flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Secure Password</label>
            <div className="relative group">
              <MdLockOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" size={20} />
              <input
                type="password"
                className="w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-600 font-medium hover:border-slate-600/80 shadow-inner"
                placeholder="••••••••"
                {...register("password", { required: "Minimum 6 characters", minLength: 6 })}
              />
            </div>
            {errors.password && (
              <p className="text-rose-400 text-[11px] font-bold pl-2 uppercase tracking-wider flex items-center gap-1 mt-1">
                <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-lg border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out blur-md"></div>
            {isSubmitting ? (
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="relative z-10">Complete Registration</span>
                <MdArrowForward className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </>
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center pt-6 border-t border-white/5 relative">
            <p className="text-slate-500 font-medium text-sm">
              Already have a profile?{" "}
              <Link to="/login" className="text-emerald-400 hover:text-white font-bold transition-all p-1 relative inline-block group">
                Sign In
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-12 text-center opacity-40 mix-blend-plus-lighter">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] drop-shadow-lg">
            Verified Personnel Only • v4.2.0
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
