import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { assignSalaryTemplate } from "../services/payrollApi";
import { toast } from "react-hot-toast";

export default function SalaryTemplateAssign() {
  const { id } = useParams(); // employeeCode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/salary-template/template", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTemplates(res.data));
  }, []);

  const handleAssign = async (templateId) => {
    try {
      await assignSalaryTemplate(id, templateId);
      toast.success("Template Assigned!");
      navigate("/payroll-profiles");
    } catch (err) {
      toast.error("Failed to assign template");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Assign Salary Template — {id}
        </h2>

        {templates.length > 0 ? (
          templates.map(t => (
            <button
              key={t._id}
              onClick={() => handleAssign(t._id)}
              className="block w-full text-left border p-3 mb-2 rounded hover:bg-gray-200"
            >
              {t.name}
            </button>
          ))
        ) : (
          <p>No Salary Templates Found</p>
        )}
      </div>
    </div>
  );
}
