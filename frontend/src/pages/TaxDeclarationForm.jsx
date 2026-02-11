import { useState } from "react";
import { toast } from "react-hot-toast";
import { createDeclaration } from "../services/taxService";

export default function TaxDeclarationForm() {
  const [form, setForm] = useState({
    employeeId: "",
    financialYear: "",
    selectedRegime: "old",
    totalIncome: "",
    investments: "",
  });
  const [proofFiles, setProofFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createDeclaration({
        ...form,
        totalIncome: Number(form.totalIncome || 0),
        investments: Number(form.investments || 0),
        proofFiles,
      });
      toast.success("Tax declaration saved");
      setForm({
        employeeId: "",
        financialYear: "",
        selectedRegime: "old",
        totalIncome: "",
        investments: "",
      });
      setProofFiles([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save declaration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Tax Declaration Form</h2>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Employee ID (Mongo ObjectId)"
            value={form.employeeId}
            onChange={(e) => onChange("employeeId", e.target.value)}
            required
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Financial Year (e.g. 2025-2026)"
            value={form.financialYear}
            onChange={(e) => onChange("financialYear", e.target.value)}
            required
          />

          <select
            className="w-full border p-2 rounded"
            value={form.selectedRegime}
            onChange={(e) => onChange("selectedRegime", e.target.value)}
          >
            <option value="old">Old Regime</option>
            <option value="new">New Regime</option>
          </select>

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Total Income"
            value={form.totalIncome}
            onChange={(e) => onChange("totalIncome", e.target.value)}
            required
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Investments"
            value={form.investments}
            onChange={(e) => onChange("investments", e.target.value)}
          />

          <input
            type="file"
            multiple
            className="w-full border p-2 rounded"
            onChange={(e) => setProofFiles(Array.from(e.target.files || []))}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Declaration"}
          </button>
        </form>
      </div>
    </div>
  );
}
