import { useState, useEffect } from "react";
import { createSalaryTemplate, updateSalaryTemplate, getSalaryTemplates } from "../../services/salaryTemplateApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function SalaryTemplateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    earnings: {
      basicPercent: 50,
      hraPercent: 40,
      allowancePercent: 10
    },
    deductions: {
      pfPercent: 12,
      esiPercent: 0.75,
      taxPercent: 10
    }
  });

  useEffect(() => {
    if (id) loadExisting();
  }, [id]);

  const loadExisting = async () => {
    try {
      const res = await getSalaryTemplates();
      const template = res.data.find((t) => t._id === id);
      if (template) setForm(template);
    } catch (error) {
      toast.error("Failed to load template");
    }
  };

  const handleChange = (path, value) => {
    const parts = path.split(".");
    if (parts.length === 1) {
      setForm({ ...form, [path]: value });
    } else {
      setForm({
        ...form,
        [parts[0]]: {
          ...form[parts[0]],
          [parts[1]]: value
        }
      });
    }
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      name: form.name,
      basicPercent: Number(form.earnings.basicPercent),
      hraPercent: Number(form.earnings.hraPercent),
      allowancePercent: Number(form.earnings.allowancePercent),
      pfPercent: Number(form.deductions.pfPercent),
      esiPercent: Number(form.deductions.esiPercent),
      taxPercent: Number(form.deductions.taxPercent)
    };

    if (id) {
      await updateSalaryTemplate(id, payload);
      toast.success("Template updated successfully!");
    } else {
      await createSalaryTemplate(payload);
      toast.success("Template created successfully!");
    }

    navigate("/salary-template");
    } catch (error) {
      toast.error("Failed to save template");
      console.error(error);
    }
  };


  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Salary Template" : "Create Salary Template"}
      </h2>

      <form onSubmit={onSubmit} className="grid gap-3 bg-white p-4 shadow rounded">

        <input
          className="border p-2 rounded"
          placeholder="Template Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <h3 className="font-semibold mt-2">Earnings</h3>
        <input
          className="border p-2 rounded"
          placeholder="Basic %"
          type="number"
          value={form.earnings.basicPercent}
          onChange={(e) => handleChange("earnings.basicPercent", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="HRA %"
          type="number"
          value={form.earnings.hraPercent}
          onChange={(e) => handleChange("earnings.hraPercent", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Allowances %"
          type="number"
          value={form.earnings.allowancesPercent}
          onChange={(e) => handleChange("earnings.allowancesPercent", e.target.value)}
        />

        <h3 className="font-semibold mt-2">Deductions</h3>
        <input
          className="border p-2 rounded"
          placeholder="PF %"
          type="number"
          value={form.deductions.pfPercent}
          onChange={(e) => handleChange("deductions.pfPercent", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="ESI %"
          type="number"
          value={form.deductions.esiPercent}
          onChange={(e) => handleChange("deductions.esiPercent", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Tax %"
          type="number"
          value={form.deductions.taxPercent}
          onChange={(e) => handleChange("deductions.taxPercent", e.target.value)}
        />

        <button className="bg-blue-600 text-white p-2 rounded mt-2">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
