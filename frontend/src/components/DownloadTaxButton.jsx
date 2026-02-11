import { useState } from "react";
import { toast } from "react-hot-toast";
import { downloadTaxPDF } from "../services/taxService";

export default function DownloadTaxButton({ declarationId, fileName = "tax-statement.pdf" }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await downloadTaxPDF(declarationId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to download tax statement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !declarationId}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
    >
      {loading ? "Downloading..." : "Download Tax PDF"}
    </button>
  );
}
