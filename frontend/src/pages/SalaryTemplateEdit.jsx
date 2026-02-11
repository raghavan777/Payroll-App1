import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSalaryTemplates,
  updateSalaryTemplate,
} from "../services/salaryTemplateApi";

const SalaryTemplateEdit = () => {
  const { id } = useParams();               // ✅ READ URL PARAM
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    basic: "",
    hra: "",
    allowances: "",
    pf: "",
    esi: "",
  });

  /* ===========================
     LOAD TEMPLATE DATA
     =========================== */
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await getSalaryTemplates(id);
        const t = res.data;

        setForm({
          name: t.name || "",
          basic: t.basic || "",
          hra: t.hra || "",
          allowances: t.allowances || "",
          pf: t.pf || "",
          esi: t.esi || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load salary template");
        navigate("/salary-template");
      }
    };

    fetchTemplate();
  }, [id, navigate]);

  /* ===========================
     HANDLE CHANGE
     =========================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===========================
     HANDLE UPDATE
     =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSalaryTemplate(id, {
        name: form.name,
        basic: Number(form.basic),
        hra: Number(form.hra),
        allowances: Number(form.allowances),
        pf: Number(form.pf),
        esi: Number(form.esi),
      });

      alert("Salary Template Updated Successfully");
      navigate("/salary-template");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ===========================
     LOADING STATE
     =========================== */
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading salary template...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">

        <h2 className="text-xl font-semibold mb-6">
          Edit Salary Template
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* Template Name */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Template Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Basic */}
          <div>
            <label className="block mb-1 font-medium">Basic Salary</label>
            <input
              name="basic"
              type="number"
              value={form.basic}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* HRA */}
          <div>
            <label className="block mb-1 font-medium">HRA</label>
            <input
              name="hra"
              type="number"
              value={form.hra}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Allowances */}
          <div>
            <label className="block mb-1 font-medium">Allowances</label>
            <input
              name="allowances"
              type="number"
              value={form.allowances}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* PF */}
          <div>
            <label className="block mb-1 font-medium">PF</label>
            <input
              name="pf"
              type="number"
              value={form.pf}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* ESI */}
          <div>
            <label className="block mb-1 font-medium">ESI</label>
            <input
              name="esi"
              type="number"
              value={form.esi}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* SUBMIT */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryTemplateEdit;  
