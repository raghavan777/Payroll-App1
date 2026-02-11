import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SalaryTemplateList() {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadTemplates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/salary-template/template", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data);
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Salary Templates</h2>
          <button
            onClick={() => navigate("/salary-template/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Template
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Template Name</th>
              <th className="p-2 border">Earnings</th>
              <th className="p-2 border">Deductions</th>
            </tr>
          </thead>
          <tbody>
            {templates.length > 0 ? templates.map(t => (
              <tr key={t._id}>
                <td className="p-2 border">{t.name}</td>
                <td className="p-2 border">{t.earnings.length} Components</td>
                <td className="p-2 border">{t.deductions.length} Components</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
