import { useState } from "react";
import { createPayrollProfile } from "../services/payrollApi";

const PayrollProfileForm = () => {
  const [form, setForm] = useState({
    employeeCode: "",          // UI input
    basic: "",
    hra: "",
    allowances: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    taxRegime: "Old",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPayrollProfile({
        // 🔥 FIX: backend expects employeeCode
        employeeCode: form.employeeCode,

        salaryStructure: {
          basic: Number(form.basic),
          hra: Number(form.hra),
          allowances: Number(form.allowances),
        },

        bankDetails: {
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
        },

        taxRegime: form.taxRegime,
      });

      alert("Payroll Profile Saved Successfully");

      // Optional: reset form
      setForm({
        employeeCode: "",
        basic: "",
        hra: "",
        allowances: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        taxRegime: "Old",
      });

    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save payroll profile");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Employee Payroll Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Employee Code
            </label>
            <input
              name="employeeCode"
              value={form.employeeCode}
              onChange={handleChange}
              placeholder="EMP-2026-0003"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Tax Regime */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tax Regime
            </label>
            <select
              name="taxRegime"
              value={form.taxRegime}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Old">Old</option>
              <option value="New">New</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Basic Salary
            </label>
            <input
              name="basic"
              type="number"
              value={form.basic}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              HRA
            </label>
            <input
              name="hra"
              type="number"
              value={form.hra}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Allowances
            </label>
            <input
              name="allowances"
              type="number"
              value={form.allowances}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bank Name
            </label>
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Account Number
            </label>
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              IFSC Code
            </label>
            <input
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Payroll Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollProfileForm;
