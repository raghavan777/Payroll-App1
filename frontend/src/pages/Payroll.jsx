import { useState } from "react";
import { secureAction } from "../utils/secureAction";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Payroll() {
  const { hasPermission } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);

  const runPayroll = async () => {
    if (!hasPermission("run_payroll")) {
      return setStatus({ type: "error", msg: "You are not allowed to run payroll!" });
    }

    setIsRunning(true);
    setStatus(null);

    try {
      const res = await secureAction((extraHeaders = {}) =>
        axios.post(
          "http://localhost:5000/api/payroll/run",
          {},
          { headers: extraHeaders, withCredentials: true }
        )
      );

      setStatus({ type: "success", msg: res.data?.message || "Payroll run successfully!" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Payroll failed"
      });
    }

    setIsRunning(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Payroll</h2>

      <p className="text-gray-600 mb-6">
        This module calculates employee salaries, deductions, statutory compliance, and generates payslips.
      </p>

      {status && (
        <div
          className={`p-3 mb-4 rounded ${
            status.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status.msg}
        </div>
      )}

      <button
        onClick={runPayroll}
        disabled={isRunning}
        className={`px-6 py-2 rounded text-white font-medium transition ${
          isRunning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isRunning ? "Running Payroll..." : "Run Payroll"}
      </button>
    </div>
  );
}
