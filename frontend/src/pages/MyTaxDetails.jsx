import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getMyDeclaration } from "../services/taxService";
import DownloadTaxButton from "../components/DownloadTaxButton";

export default function MyTaxDetails() {
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyDeclaration();
        setDeclaration(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load tax details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Loading tax details...</p>;
  if (!declaration) return <p className="p-6 text-gray-500">No tax declaration found.</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">My Tax Details</h2>

        <div className="space-y-2 mb-6">
          <p><strong>Financial Year:</strong> {declaration.financialYear}</p>
          <p><strong>Regime:</strong> {declaration.selectedRegime?.toUpperCase()}</p>
          <p><strong>Total Income:</strong> {declaration.totalIncome}</p>
          <p><strong>Investments:</strong> {declaration.investments}</p>
          <p><strong>Taxable Income:</strong> {declaration.taxableIncome}</p>
          <p className="font-semibold"><strong>Calculated Tax:</strong> {declaration.calculatedTax}</p>
        </div>

        <DownloadTaxButton
          declarationId={declaration._id}
          fileName={`tax-statement-${declaration.financialYear}.pdf`}
        />
      </div>
    </div>
  );
}
