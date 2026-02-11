import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SalaryPreview() {
  const { id } = useParams(); // profileId
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/salary-template/calculate/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load preview");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [id, token]);

  if (loading) return <p className="p-6">Loading salary preview...</p>;
  if (!data) return <p className="p-6">No salary data found</p>;

  const {
    templateName,
    earnings,
    deductions,
    netSalary,
    employeeCode
  } = data;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        
        <h2 className="text-2xl font-semibold mb-4">
          Salary Preview — {employeeCode}
        </h2>

        {templateName && (
          <p className="mb-4 text-gray-600">
            <b>Template:</b> {templateName}
          </p>
        )}

        {/* Earnings */}
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-2">Earnings</h3>
          <p><b>Basic:</b> ₹{earnings?.basic?.toFixed?.(2)}</p>
          <p><b>HRA:</b> ₹{earnings?.hra?.toFixed?.(2)}</p>
          <p><b>Allowances:</b> ₹{earnings?.allowances?.toFixed?.(2)}</p>
          <p><b>Gross Salary:</b> ₹{earnings?.grossSalary?.toFixed?.(2)}</p>
        </div>

        {/* Deductions */}
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-2">Deductions</h3>
          <p><b>PF:</b> ₹{deductions?.pf?.toFixed?.(2)}</p>
          <p><b>ESI:</b> ₹{deductions?.esi?.toFixed?.(2)}</p>
          <p><b>Tax:</b> ₹{deductions?.tax?.toFixed?.(2)}</p>
          <p><b>Total Deductions:</b> ₹{deductions?.total?.toFixed?.(2)}</p>
        </div>

        {/* Net Salary */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Net Salary</h3>
          <p className="text-green-600 font-medium text-lg">
            ₹{netSalary?.toFixed?.(2)}
          </p>
        </div>

        {/* Back Button */}
        <div className="flex gap-4">
          <Link
            to={`/payroll-profile/${employeeCode}`}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Profile
          </Link>
        </div>

      </div>
    </div>
  );
}
