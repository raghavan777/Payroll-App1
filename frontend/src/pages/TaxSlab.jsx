import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TaxSlab() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/statutory/tax-slab", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Tax slab created!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add tax slab");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Tax Slab</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 max-w-md bg-white p-4 rounded shadow">

        <input className="border p-2 rounded" placeholder="Country" {...register("country")} />
        <input className="border p-2 rounded" placeholder="State" {...register("state")} />
        <input className="border p-2 rounded" placeholder="Min Income" type="number" {...register("minIncome")} />
        <input className="border p-2 rounded" placeholder="Max Income" type="number" {...register("maxIncome")} />
        <input className="border p-2 rounded" placeholder="Tax %" type="number" {...register("taxPercentage")} />

        <button className="bg-violet-600 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
