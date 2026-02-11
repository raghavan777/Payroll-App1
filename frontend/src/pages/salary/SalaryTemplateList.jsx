import { useEffect, useState } from "react";
import { getSalaryTemplates, deleteSalaryTemplate } from "../../services/salaryTemplateApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function SalaryTemplateList() {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  const loadTemplates = async () => {
    try {
      const res = await getSalaryTemplates();
      setTemplates(res.data);
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await deleteSalaryTemplate(id);
      toast.success("Template deleted");
      loadTemplates();
    } catch {
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Salary Templates</h2>
        <button
          onClick={() => navigate("/salary-template/new")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Template
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Basic %</th>
            <th className="p-2 border">HRA %</th>
            <th className="p-2 border">Allowance %</th>
            <th className="p-2 border">PF %</th>
            <th className="p-2 border">ESI %</th>
            <th className="p-2 border">Tax %</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {templates.map((t) => (
            <tr key={t._id}>
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.basicPercent}%</td>
              <td className="p-2 border">{t.hraPercent}%</td>
              <td className="p-2 border">{t.allowancePercent}%</td>
              <td className="p-2 border">{t.pfPercent}%</td>
              <td className="p-2 border">{t.esiPercent}%</td>
              <td className="p-2 border">{t.taxPercent}%</td>
              <td className="p-2 border">
                <button
                  className="text-blue-600"
                  onClick={() => navigate(`/salary-template/edit/${t._id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 ml-3"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {templates.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No templates found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
