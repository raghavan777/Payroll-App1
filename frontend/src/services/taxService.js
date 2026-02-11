import api from "../api/axios";

export const createSlab = async (payload) => {
  const res = await api.post("/api/tax/slabs", payload);
  return res.data;
};

export const createDeclaration = async (payload) => {
  const formData = new FormData();
  formData.append("employeeId", payload.employeeId);
  formData.append("financialYear", payload.financialYear);
  formData.append("selectedRegime", payload.selectedRegime);
  formData.append("totalIncome", payload.totalIncome);
  formData.append("investments", payload.investments || 0);

  (payload.proofFiles || []).forEach((file) => {
    formData.append("proofFiles", file);
  });

  const res = await api.post("/api/tax/declarations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateDeclaration = async (id, payload) => {
  const formData = new FormData();

  if (payload.financialYear) formData.append("financialYear", payload.financialYear);
  if (payload.selectedRegime) formData.append("selectedRegime", payload.selectedRegime);
  if (payload.totalIncome !== undefined) formData.append("totalIncome", payload.totalIncome);
  if (payload.investments !== undefined) formData.append("investments", payload.investments);

  (payload.proofFiles || []).forEach((file) => {
    formData.append("proofFiles", file);
  });

  const res = await api.put(`/api/tax/declarations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getDeclarations = async () => {
  const res = await api.get("/api/tax/declarations");
  return res.data;
};

export const getMyDeclaration = async (financialYear) => {
  const query = financialYear ? `?financialYear=${encodeURIComponent(financialYear)}` : "";
  const res = await api.get(`/api/tax/my-declaration${query}`);
  return res.data;
};

export const getProjection = async ({ financialYear, regime } = {}) => {
  const params = new URLSearchParams();
  if (financialYear) params.append("financialYear", financialYear);
  if (regime) params.append("regime", regime);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/api/tax/projection${query}`);
  return res.data;
};

export const downloadTaxPDF = async (id) => {
  const res = await api.get(`/api/tax/download/${id}`, {
    responseType: "blob",
  });
  return res.data;
};
