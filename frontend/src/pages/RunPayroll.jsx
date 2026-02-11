import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RunPayroll() {
  const navigate = useNavigate();

  const [employeeCode, setEmployeeCode] = useState("");
  const [country] = useState("India");
  const [state] = useState("TamilNadu");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleRunPayroll = async () => {
    if (!employeeCode || !startDate || !endDate) {
      return toast.error("Please fill all required fields");
    }

    try {
      await api.post("/api/payroll/run", {
        employeeCode,
        country,
        state,
        startDate,
        endDate,
      });

      toast.success("Payroll generated successfully");
      navigate("/payroll-preview"); // ✅ correct route

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Payroll failed");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-semibold mb-4">Run Payroll</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
        />

        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          className="border p-2 w-full mb-3"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="block mb-1">End Date</label>
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={handleRunPayroll}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Run Payroll
        </button>
      </div>
    </div>
  );
}
