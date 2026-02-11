import { useState } from "react";
import { toast } from "react-hot-toast";
import { createSlab } from "../services/taxService";

const emptySlab = { min: "", max: "", rate: "" };

export default function TaxSlabForm() {
  const [regime, setRegime] = useState("old");
  const [financialYear, setFinancialYear] = useState("");
  const [slabs, setSlabs] = useState([{ ...emptySlab }]);
  const [loading, setLoading] = useState(false);

  const updateSlab = (index, key, value) => {
    const next = [...slabs];
    next[index][key] = value;
    setSlabs(next);
  };

  const addSlab = () => setSlabs((prev) => [...prev, { ...emptySlab }]);
  const removeSlab = (index) => setSlabs((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        regime,
        financialYear,
        slabs: slabs.map((s) => ({
          min: Number(s.min || 0),
          max: s.max === "" ? null : Number(s.max),
          rate: Number(s.rate || 0),
        })),
      };
      await createSlab(payload);
      toast.success("Tax slabs saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save slabs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Tax Slab Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="old">Old Regime</option>
              <option value="new">New Regime</option>
            </select>

            <input
              type="text"
              placeholder="Financial Year (e.g. 2025-2026)"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="space-y-3">
            {slabs.map((slab, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={slab.min}
                  onChange={(e) => updateSlab(index, "min", e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Max (leave empty for no upper limit)"
                  value={slab.max}
                  onChange={(e) => updateSlab(index, "max", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Rate %"
                  value={slab.rate}
                  onChange={(e) => updateSlab(index, "rate", e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSlab(index)}
                  className="bg-red-600 text-white rounded px-3"
                  disabled={slabs.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSlab}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Add Slab Row
          </button>

          <button
            type="submit"
            disabled={loading}
            className="block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Slabs"}
          </button>
        </form>
      </div>
    </div>
  );
}
