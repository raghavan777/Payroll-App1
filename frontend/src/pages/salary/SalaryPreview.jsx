import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SalaryPreview = () => {
  // ✅ profileId = PayrollProfile._id
  const { id: profileId } = useParams();

  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!profileId) {
      toast.error("Invalid payroll profile");
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/salary-template/calculate/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSalaryData(res.data);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Failed to fetch salary preview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [profileId, token]);

  if (loading) {
    return <p className="p-6">Loading salary preview...</p>;
  }

  if (!salaryData) {
    return <p className="p-6">No salary data found.</p>;
  }

  // ✅ Safe destructuring
  const {
    employeeCode,
    grossSalary = 0,
    netSalary = 0,
    deductions = {},
  } = salaryData;

  const {
    pf = 0,
    esi = 0,
    tax = 0,
    totalDeductions = 0,
  } = deductions;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Salary Preview — {employeeCode || "Profile"}
        </h2>

        {/* ================= EARNINGS ================= */}
        <div className="mb-4 pb-3 border-b">
          <h3 className="font-semibold mb-2">Earnings</h3>
          <p>
            <b>Gross Salary:</b> ₹{grossSalary.toFixed(2)}
          </p>
        </div>

        {/* ================= DEDUCTIONS ================= */}
        <div className="mb-4 pb-3 border-b">
          <h3 className="font-semibold mb-2">Deductions</h3>
          <p><b>PF:</b> ₹{pf.toFixed(2)}</p>
          <p><b>ESI:</b> ₹{esi.toFixed(2)}</p>
          <p><b>Tax:</b> ₹{tax.toFixed(2)}</p>
          <p className="font-medium">
            <b>Total Deductions:</b> ₹{totalDeductions.toFixed(2)}
          </p>
        </div>

        {/* ================= NET SALARY ================= */}
        <div className="mb-6">
          <h3 className="font-semibold mb-1">Net Salary</h3>
          <p className="text-green-600 font-bold text-xl">
            ₹{netSalary.toFixed(2)}
          </p>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-3">
          {employeeCode && (
            <Link
              to={`/payroll-profile/${employeeCode}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Profile
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default SalaryPreview;
