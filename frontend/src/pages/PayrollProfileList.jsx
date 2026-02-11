import { useEffect, useState } from "react";
import {
  getPayrollProfiles,
  deletePayrollProfile,
} from "../services/payrollApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PayrollProfileList() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  const loadProfiles = async () => {
    try {
      const res = await getPayrollProfiles();
      setProfiles(res.data);
    } catch {
      toast.error("Failed to load payroll profiles");
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (employeeCode) => {
    if (!window.confirm("Delete this payroll profile?")) return;

    try {
      await deletePayrollProfile(employeeCode);
      toast.success("Payroll profile deleted");
      loadProfiles();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payroll Profiles</h2>

          <button
            onClick={() => navigate("/payroll-profile/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Payroll Profile
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Employee Code</th>
                <th className="p-3 border">Employee Name</th>
                <th className="p-3 border">Basic</th>
                <th className="p-3 border">HRA</th>
                <th className="p-3 border">Allowances</th>
                <th className="p-3 border">Tax Regime</th>
                <th className="p-3 border">Bank</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {profiles.length ? (
                profiles.map((p) => (
                  <tr key={p._id}>
                    <td className="p-3 border font-semibold">
                      {p.employeeCode}
                    </td>

                    {/* ✅ EMPLOYEE NAME */}
                    <td className="p-3 border">
                      {p.employeeName || "—"}
                    </td>

                    <td className="p-3 border">
                      {p.salaryStructure?.basic}
                    </td>
                    <td className="p-3 border">
                      {p.salaryStructure?.hra}
                    </td>
                    <td className="p-3 border">
                      {p.salaryStructure?.allowances}
                    </td>
                    <td className="p-3 border">
                      {p.taxRegime}
                    </td>
                    <td className="p-3 border">
                      {p.bankDetails?.bankName}
                    </td>

                    {/* ✅ ACTIONS */}
                    <td className="p-3 border">
                      <div className="flex gap-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() =>
                            navigate(`/payroll-profile/${p.employeeCode}`)
                          }
                        >
                          View
                        </button>

                        <button
                          className="text-green-600 hover:underline"
                          onClick={() =>
                            navigate(
                              `/payroll-profile/edit/${p.employeeCode}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="text-orange-600 hover:underline"
                          onClick={() =>
                            navigate(`/attendance/${p.employeeCode}`)
                          }
                        >
                          Attendance
                        </button>

                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(p.employeeCode)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-5">
                    No payroll profiles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
