import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPayrollProfile, updatePayrollProfile } from "../services/payrollApi";

const PayrollProfileEdit = () => {
  const { employeeCode } = useParams(); // employeeCode
  const navigate = useNavigate();

  const [form, setForm] = useState({
    basic: "",
    hra: "",
    allowances: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    taxRegime: "Old",
  });

  useEffect(() => {
    getPayrollProfile(employeeCode).then((res) => {
      const p = res.data;
      setForm({
        basic: p.salaryStructure?.basic || "",
        hra: p.salaryStructure?.hra || "",
        allowances: p.salaryStructure?.allowances || "",
        bankName: p.bankDetails?.bankName || "",
        accountNumber: p.bankDetails?.accountNumber || "",
        ifsc: p.bankDetails?.ifsc || "",
        taxRegime: p.taxRegime || "Old",
      });
    });
  }, [employeeCode]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updatePayrollProfile(employeeCode, {
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

    alert("Profile Updated!");
    navigate("/payroll-profiles");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Edit Payroll Profile</h2>

        <form onSubmit={handleSubmit} className="gremployeeCode gremployeeCode-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Basic Salary</label>
            <input
              name="basic"
              value={form.basic}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">HRA</label>
            <input
              name="hra"
              value={form.hra}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Allowances</label>
            <input
              name="allowances"
              value={form.allowances}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Account Number
            </label>
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">IFSC Code</label>
            <input
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tax Regime</label>
            <select
              name="taxRegime"
              value={form.taxRegime}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="Old">Old</option>
              <option value="New">New</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayrollProfileEdit;
