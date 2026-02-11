import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterOrg() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{ errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register-org", data);
      toast.success("Organization Registered Successfully!");
      navigate("/login");
    } catch (err) {
        console.log("REGISTER ERROR:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Organization Setup 🏢
        </h2>

        {/* Org Details */}
        <p className="font-medium text-gray-700 mb-2">Organization Details</p>

        <input className="w-full border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-violet-500"
          placeholder="Organization Name" {...register("orgName",{required:"Organization name is required"})} />
        {errors.orgName && <p className="text-red-500 text-xs mb-2">{errors.orgName.message}</p>}

        <input className="w-full border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-violet-500"
          placeholder="Country" {...register("country",{required:"Country is required"})} />
        {errors.country && <p className="text-red-500 text-xs mb-2">{errors.country.message}</p>}

        <input className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-violet-500"
          placeholder="Domain (ex: tech, finance)" {...register("domain",{required:"Domain is required"})} />
        {errors.domain && <p className="text-red-500 text-xs mb-2">{errors.domain.message}</p>}

        {/* Admin Details */}
        <p className="font-medium text-gray-700 mb-2">Admin Details</p>

        <input className="w-full border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-violet-500"
          placeholder="Admin Name" {...register("adminName",{required:"Admin name is required"})} />
        {errors.adminName && <p className="text-red-500 text-xs mb-2">{errors.adminName.message}</p>}

        <input className="w-full border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-violet-500"
          type="email" placeholder="Admin Email"
          {...register("adminEmail",{required:"Admin email is required",pattern:{value:/^\S+@\S+$/i,message:"Invalid email"}})} />
        {errors.adminEmail && <p className="text-red-500 text-xs mb-2">{errors.adminEmail.message}</p>}

        <input className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-violet-500"
          type="password" placeholder="Password (min 6 chars)"
          {...register("password",{required:"Password is required",minLength:{value:6,message:"Min 6 characters"}})} />
        {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>}

        <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded-lg mt-2 hover:bg-violet-700 transition">
          Register Organization
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-violet-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
