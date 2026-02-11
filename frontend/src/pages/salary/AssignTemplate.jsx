import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AssignTemplate() {
  const { id } = useParams(); // profileId
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/salary-template/template", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTemplates(res.data));
  }, []);

  const assign = async (templateId) => {
    try {
      await axios.post("http://localhost:5000/api/salary-template/assign",
        { profileId: id, templateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Template Assigned!");
      navigate(`/payroll-profile/${id}`);
    } catch {
      toast.error("Assignment Failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4 font-semibold">Assign Template</h2>
      <div className="space-y-2">
        {templates.map(t => (
          <div key={t._id} className="flex justify-between p-3 shadow bg-white rounded">
            <span>{t.name}</span>
            <button
              onClick={() => assign(t._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
