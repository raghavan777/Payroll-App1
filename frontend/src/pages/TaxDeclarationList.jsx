import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getDeclarations } from "../services/taxService";

export default function TaxDeclarationList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDeclarations();
      setRows(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load declarations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p className="p-6">Loading tax declarations...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Tax Declarations</h2>

        {rows.length === 0 ? (
          <p className="text-gray-500">No declarations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Employee</th>
                  <th className="border p-2">Code</th>
                  <th className="border p-2">FY</th>
                  <th className="border p-2">Regime</th>
                  <th className="border p-2">Taxable Income</th>
                  <th className="border p-2">Calculated Tax</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d._id}>
                    <td className="border p-2">{d.employeeId?.name || "-"}</td>
                    <td className="border p-2">{d.employeeId?.employeeCode || "-"}</td>
                    <td className="border p-2">{d.financialYear}</td>
                    <td className="border p-2 uppercase">{d.selectedRegime}</td>
                    <td className="border p-2">{d.taxableIncome}</td>
                    <td className="border p-2 font-semibold">{d.calculatedTax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
