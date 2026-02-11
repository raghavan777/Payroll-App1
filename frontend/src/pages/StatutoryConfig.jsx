import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function StatutoryConfig() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/statutory/statutory", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Statutory configuration added!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add config");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Statutory Config</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 max-w-md bg-white p-4 rounded shadow">

        <input className="border p-2 rounded" placeholder="Country" {...register("country")} />
        <input className="border p-2 rounded" placeholder="State" {...register("state")} />
        <input className="border p-2 rounded" placeholder="PF %" type="number" {...register("pfPercentage")} />
        <input className="border p-2 rounded" placeholder="ESI %" type="number" {...register("esiPercentage")} />
        <input className="border p-2 rounded" placeholder="Professional Tax" type="number" {...register("professionalTax")} />

        <button className="bg-violet-600 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
