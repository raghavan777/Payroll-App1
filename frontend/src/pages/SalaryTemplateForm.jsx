import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SalaryTemplateForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    earnings: [],
    deductions: []
  });

  const addRow = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { name: "", calculationType: "FIXED", value: 0 }]
    });
  };

  const updateRow = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const saveTemplate = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/salary-template/template",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Template created!");
      navigate("/salary-template");
    } catch (err) {
      toast.error("Failed to save template");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">

        <h2 className="text-xl font-semibold mb-4">Create Salary Template</h2>

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Template Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EARNINGS */}
        <h3 className="text-lg font-semibold mb-2">Earnings</h3>
        {form.earnings.map((e, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              placeholder="Name"
              className="border p-2 rounded flex-1"
              onChange={(ev) => updateRow("earnings", i, "name", ev.target.value)}
            />
            <select
              className="border p-2 rounded"
              onChange={(ev) => updateRow("earnings", i, "calculationType", ev.target.value)}
            >
              <option value="FIXED">Fixed</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
            <input
              type="number"
              placeholder="Value"
              className="border p-2 rounded w-24"
              onChange={(ev) => updateRow("earnings", i, "value", ev.target.value)}
            />
          </div>
        ))}
        <button onClick={() => addRow("earnings")} className="text-blue-600 mb-4">+ Add Earning</button>

        {/* DEDUCTIONS */}
        <h3 className="text-lg font-semibold mb-2">Deductions</h3>
        {form.deductions.map((d, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              placeholder="Name"
              className="border p-2 rounded flex-1"
              onChange={(ev) => updateRow("deductions", i, "name", ev.target.value)}
            />
            <select
              className="border p-2 rounded"
              onChange={(ev) => updateRow("deductions", i, "calculationType", ev.target.value)}
            >
              <option value="FIXED">Fixed</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
            <input
              type="number"
              placeholder="Value"
              className="border p-2 rounded w-24"
              onChange={(ev) => updateRow("deductions", i, "value", ev.target.value)}
            />
          </div>
        ))}
        <button onClick={() => addRow("deductions")} className="text-blue-600 mb-4">+ Add Deduction</button>

        <button
          onClick={saveTemplate}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Save Template
        </button>

      </div>
    </div>
  );
}
