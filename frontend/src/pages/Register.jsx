import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { MdPersonAdd, MdEmail, MdLockOutline, MdPersonOutline, MdArrowForward } from "react-icons/md";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-[480px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[40px] p-10 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-[28px] shadow-2xl shadow-emerald-600/20 mb-6 transform hover:-rotate-3 transition-transform">
              <MdPersonAdd className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Join Our Team</h1>
            <p className="text-slate-400 font-medium">Create your professional profile in seconds.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest opacity-80">Full Name</label>
              <div className="relative group">
                <MdPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="John Doe"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className="text-rose-400 text-xs font-bold pl-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest opacity-80">Work Email</label>
              <div className="relative group">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input
                  type="email"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="john@company.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-xs font-bold pl-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest opacity-80">Secure Password</label>
              <div className="relative group">
                <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input
                  type="password"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="••••••••"
                  {...register("password", { required: "Minimum 6 characters", minLength: 6 })}
                />
              </div>
              {errors.password && <p className="text-rose-400 text-xs font-bold pl-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 group flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-slate-400 font-medium">
              Already have a profile?{" "}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
