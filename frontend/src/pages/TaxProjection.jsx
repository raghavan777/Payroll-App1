import { useState } from "react";
import { toast } from "react-hot-toast";
import { getProjection } from "../services/taxService";

export default function TaxProjection() {
  const [financialYear, setFinancialYear] = useState("");
  const [regime, setRegime] = useState("old");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjection = async () => {
    try {
      setLoading(true);
      const data = await getProjection({ financialYear, regime });
      setResult(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch projection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Tax Projection</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Financial Year (optional)"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
          >
            <option value="old">Old Regime</option>
            <option value="new">New Regime</option>
          </select>
        </div>

        <button
          onClick={fetchProjection}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Calculating..." : "Get Projection"}
        </button>

        {result && (
          <div className="mt-6 border rounded p-4 bg-gray-50 space-y-1">
            <p><strong>Employee Code:</strong> {result.employeeCode}</p>
            <p><strong>Financial Year:</strong> {result.financialYear}</p>
            <p><strong>Regime:</strong> {result.selectedRegime?.toUpperCase()}</p>
            <p><strong>Total Income:</strong> {result.totalIncome}</p>
            <p><strong>Investments:</strong> {result.investments}</p>
            <p><strong>Taxable Income:</strong> {result.taxableIncome}</p>
            <p className="font-semibold"><strong>Projected Tax:</strong> {result.projectedTax}</p>
          </div>
        )}
      </div>
    </div>
  );
}
