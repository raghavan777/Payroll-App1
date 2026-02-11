import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getPayrollProfile } from "../services/payrollApi";

const PayrollProfileView = () => {
  const { employeeCode } = useParams();

  const [profile, setProfile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const token = localStorage.getItem("token");

  /* ================================
     LOAD PAYROLL PROFILE
  ================================ */
  const loadProfile = async () => {
    try {
      const res = await getPayrollProfile(employeeCode);
      setProfile(res.data);
    } catch {
      toast.error("Failed to fetch payroll profile");
    }
  };

  useEffect(() => {
    if (!employeeCode) return;
    loadProfile();
  }, [employeeCode]);

  /* ================================
     LOAD SALARY TEMPLATES
  ================================ */
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/salary-template", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTemplates(res.data))
      .catch(() => toast.error("Failed to load salary templates"));
  }, [token]);

  /* ================================
     ASSIGN SALARY TEMPLATE
  ================================ */
  const handleTemplateAssign = async () => {
    if (!selectedTemplate) {
      return toast.error("Please select a salary template");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/payroll-profile/${employeeCode}/assign-template`,
        { templateId: selectedTemplate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Salary template assigned successfully");
      setSelectedTemplate("");
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign template");
    }
  };

  if (!profile) {
    return <p className="p-6">Loading...</p>;
  }

  const salary = profile.salaryStructure;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md">

        <h2 className="text-2xl font-semibold mb-1">
          Payroll Profile — {profile.employeeCode}
        </h2>

        <p className="text-gray-600 mb-4">
          <b>Employee Name:</b> {profile.employeeName || "—"}
        </p>

        {/* ================= PROFILE DETAILS ================= */}
        <div className="space-y-2">
          <p><b>Basic:</b> ₹{salary?.basic ?? "Not Assigned"}</p>
          <p><b>HRA:</b> ₹{salary?.hra ?? "Not Assigned"}</p>
          <p><b>Allowances:</b> ₹{salary?.allowances ?? "Not Assigned"}</p>
          <p><b>Bank:</b> {profile.bankDetails?.bankName ?? "—"}</p>
          <p><b>Account No:</b> {profile.bankDetails?.accountNumber ?? "—"}</p>
          <p><b>IFSC:</b> {profile.bankDetails?.ifsc ?? "—"}</p>
          <p><b>Tax Regime:</b> {profile.taxRegime ?? "—"}</p>
        </div>

        {/* ================= ASSIGN SALARY TEMPLATE ================= */}
        <div className="mt-6">
          <label className="block font-medium mb-1">
            Assign Salary Template
          </label>

          <select
            className="border p-2 w-full rounded"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="">-- Select Template --</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleTemplateAssign}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Assign Template
          </button>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to={`/payroll-profile/edit/${employeeCode}`}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </Link>

          <Link
            to={`/salary-preview/${employeeCode}`}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Preview Salary
          </Link>

          <Link
            to={`/attendance/${employeeCode}`}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            View Attendance
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PayrollProfileView;
