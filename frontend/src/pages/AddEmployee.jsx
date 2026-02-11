import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    dateOfJoining: ""
  });

  const [generatedemployeeCode, setGeneratedemployeeCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEmployee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/employees",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Capture auto-generated employeeCode from backend
      setGeneratedemployeeCode(res.data.employeeCode);

      toast.success("Employee created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Employee</h2>

      <div className="space-y-4 max-w-lg">
        {/* Employee Name */}
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Employee Name"
          className="border p-2 rounded w-full"
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="Temporary Password"
          className="border p-2 rounded w-full"
        />

        {/* Department */}
        <input
          name="department"
          value={form.department}
          onChange={updateField}
          placeholder="Department"
          className="border p-2 rounded w-full"
        />

        {/* Designation */}
        <input
          name="designation"
          value={form.designation}
          onChange={updateField}
          placeholder="Designation"
          className="border p-2 rounded w-full"
        />

        {/* Date of Joining */}
        <input
          name="dateOfJoining"
          type="date"
          value={form.dateOfJoining}
          onChange={updateField}
          className="border p-2 rounded w-full"
        />

        {/* Generated Employee ID (READ ONLY) */}
        {generatedemployeeCode && (
          <div className="bg-gray-100 border p-2 rounded">
            <p className="text-sm text-gray-600">Generated Employee ID</p>
            <p className="font-semibold text-lg">{generatedemployeeCode}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={createEmployee}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>

          {generatedemployeeCode && (
            <button
              onClick={() => navigate("/employees")}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Go to Employees
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
