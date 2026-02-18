import { useEffect, useState } from "react";
import { getPayrollProfiles } from "../../services/payrollApi";
import { getSalaryTemplates, assignSalaryTemplate } from "../../services/salaryAPI";
import { toast } from "react-hot-toast";
import Dropdown from "../../components/Dropdown";

export default function AssignSalaryTemplate() {
  const [profiles, setProfiles] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profilesRes = await getPayrollProfiles();
      const templatesRes = await getSalaryTemplates();

      setProfiles(profilesRes.data);
      setTemplates(templatesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
  };

  const handleAssign = async () => {
    if (!selectedProfile || !selectedTemplate) {
      return toast.error("Select profile & template");
    }

    try {
      await assignSalaryTemplate(selectedProfile, selectedTemplate);
      toast.success("Template assigned successfully!");
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assign Salary Template</h2>

        <label className="block mb-2">Select Payroll Profile:</label>
        <Dropdown
          options={profiles.map(p => ({ value: p._id, label: p.employeeCode }))}
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
          placeholder="-- Select Profile --"
          className="mb-4"
        />

        <label className="block mb-2">Select Salary Template:</label>
        <Dropdown
          options={templates.map(t => ({ value: t._id, label: t.name }))}
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          placeholder="-- Select Template --"
          className="mb-4"
        />

        <button
          className="bg-indigo-600 text-white py-2 px-4 rounded"
          onClick={handleAssign}
        >
          Assign Template
        </button>
      </div>
    </div>
  );
}
