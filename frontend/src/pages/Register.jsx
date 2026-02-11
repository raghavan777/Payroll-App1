import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      toast.success("Account created! Please login");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Employee Registration
        </h2>

        <input
          className="w-full border border-gray-300 p-2 rounded mb-1"
          placeholder="Full Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-sm text-red-500 mb-2">{errors.name.message}</p>}

        <input
          className="w-full border border-gray-300 p-2 rounded mb-1"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email.message}</p>}

        <input
          type="password"
          className="w-full border border-gray-300 p-2 rounded mb-1"
          placeholder="Password"
          {...register("password", { required: "Password is required", minLength: 6 })}
        />
        {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-center text-blue-600 mt-4 cursor-pointer hover:underline" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
